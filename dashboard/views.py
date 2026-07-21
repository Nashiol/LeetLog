from datetime import date, timedelta

from django.contrib.auth.decorators import login_required
from django.db.models import Count
from django.http import HttpRequest, HttpResponse
from django.shortcuts import render
from django.utils.timesince import timesince

from dsa.models import DSAConcept
from leetcode.models import LeetCodeProblem


@login_required
def dashboard_view(request: HttpRequest) -> HttpResponse:
    user = request.user
    today = date.today()

    due_today = (
        LeetCodeProblem.objects
        .filter(user=user, next_review_date__lte=today)
        .exclude(status="mastered")
        .order_by("next_review_date")
    )
    due_today_count: int = due_today.count()

    difficulty_counts = (
        LeetCodeProblem.objects
        .filter(user=user)
        .values("difficulty")
        .annotate(count=Count("id"))
    )
    count_map: dict[str, int] = {
        item["difficulty"]: item["count"] for item in difficulty_counts
    }
    easy_count: int = count_map.get("easy", 0)
    medium_count: int = count_map.get("medium", 0)
    hard_count: int = count_map.get("hard", 0)
    total_problems: int = easy_count + medium_count + hard_count

    mastered_count: int = (
        LeetCodeProblem.objects
        .filter(user=user, status="mastered")
        .count()
    )
    mastered_percentage: int = (
        round(mastered_count / total_problems * 100)
        if total_problems > 0
        else 0
    )

    leetcode_dates = (
        LeetCodeProblem.objects
        .filter(user=user)
        .values_list("created_at__date", flat=True)
    )
    dsa_dates = (
        DSAConcept.objects
        .filter(user=user)
        .values_list("created_at__date", flat=True)
    )
    active_dates = sorted(
        set(list(leetcode_dates) + list(dsa_dates)),
        reverse=True,
    )
    streak = 0
    check_date = today
    for d in active_dates:
        if d == check_date:
            streak += 1
            check_date -= timedelta(days=1)
        elif d < check_date:
            break

    recent_problems = LeetCodeProblem.objects.filter(user=user)[:5]
    recent_dsa = DSAConcept.objects.filter(user=user)[:5]
    activity_items: list[dict[str, str]] = []
    for p in recent_problems:
        activity_items.append({
            "description": f"Logged #{p.problem_number} — {p.question}",
            "time": p.created_at,
        })
    for c in recent_dsa:
        activity_items.append({
            "description": f"Studied {c.topic} ({c.get_mastery_level_display()})",
            "time": c.created_at,
        })
    activity_items.sort(key=lambda x: x["time"], reverse=True)
    recent_activity: list[dict[str, str]] = [
        {"description": item["description"], "time": timesince(item["time"]) + " ago"}
        for item in activity_items[:5]
    ]

    context: dict[str, object] = {
        "due_today": due_today,
        "due_today_count": due_today_count,
        "total_problems": total_problems,
        "easy_count": easy_count,
        "medium_count": medium_count,
        "hard_count": hard_count,
        "mastered_count": mastered_count,
        "mastered_percentage": mastered_percentage,
        "streak": streak,
        "recent_activity": recent_activity,
        "today": today,
    }

    return render(request, "dashboard/dashboard.html", context)
