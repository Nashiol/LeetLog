from datetime import date, timedelta

from django.contrib import messages
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.decorators import login_required
from django.db.models import Count, Q
from django.http import HttpRequest, HttpResponse
from django.shortcuts import redirect, render
from django.utils.timesince import timesince

from coding_questions.models import CodingQuestion
from dsa.models import DSAConcept
from interview_questions.models import InterviewQuestion
from jobs.models import JobApplication
from leetcode.models import LeetCodeProblem
from system_design.models import SystemDesign

from .forms import ChangePasswordForm, ProfileForm


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
    interview_dates = (
        InterviewQuestion.objects
        .filter(user=user)
        .values_list("created_at__date", flat=True)
    )
    coding_dates = (
        CodingQuestion.objects
        .filter(user=user)
        .values_list("created_at__date", flat=True)
    )
    system_design_dates = (
        SystemDesign.objects
        .filter(user=user)
        .values_list("created_at__date", flat=True)
    )
    job_dates = (
        JobApplication.objects
        .filter(user=user)
        .values_list("created_at__date", flat=True)
    )
    active_dates = sorted(
        set(
            list(leetcode_dates)
            + list(dsa_dates)
            + list(interview_dates)
            + list(coding_dates)
            + list(system_design_dates)
            + list(job_dates)
        ),
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
    recent_interview = InterviewQuestion.objects.filter(user=user)[:5]
    recent_coding = CodingQuestion.objects.filter(user=user)[:5]
    recent_system_design = SystemDesign.objects.filter(user=user)[:5]
    recent_jobs = JobApplication.objects.filter(user=user)[:5]
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
    for q in recent_interview:
        activity_items.append({
            "description": f"Added interview Q: {q.question}",
            "time": q.created_at,
        })
    for cq in recent_coding:
        activity_items.append({
            "description": f"Added coding Q: {cq.question[:60]}",
            "time": cq.created_at,
        })
    for sd in recent_system_design:
        activity_items.append({
            "description": f"Added system design Q: {sd.question[:60]} ({sd.company})",
            "time": sd.created_at,
        })
    for j in recent_jobs:
        activity_items.append({
            "description": f"Applied to {j.job_title} at {j.company}",
            "time": j.created_at,
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


@login_required
def search_view(request: HttpRequest) -> HttpResponse:
    query = request.GET.get("q", "").strip()
    user = request.user

    leetcode_results: list = []
    dsa_results: list = []
    interview_results: list = []
    coding_results: list = []
    system_design_results: list = []

    if query:
        leetcode_results = list(
            LeetCodeProblem.objects.filter(
                Q(question__icontains=query)
                | Q(problem_number__icontains=query)
                | Q(notes__icontains=query),
                user=user,
            )[:20]
        )
        dsa_results = list(
            DSAConcept.objects.filter(
                Q(topic__icontains=query)
                | Q(resource_used__icontains=query)
                | Q(notes__icontains=query),
                user=user,
            )[:20]
        )
        interview_results = list(
            InterviewQuestion.objects.filter(
                Q(question__icontains=query)
                | Q(answer__icontains=query)
                | Q(notes__icontains=query),
                user=user,
            )[:20]
        )
        coding_results = list(
            CodingQuestion.objects.filter(
                Q(question__icontains=query) | Q(notes__icontains=query),
                user=user,
            )[:20]
        )
        system_design_results = list(
            SystemDesign.objects.filter(
                Q(question__icontains=query)
                | Q(company__icontains=query)
                | Q(answer__icontains=query)
                | Q(notes__icontains=query),
                user=user,
            )[:20]
        )

    total_results = (
        len(leetcode_results)
        + len(dsa_results)
        + len(interview_results)
        + len(coding_results)
        + len(system_design_results)
    )

    context: dict[str, object] = {
        "query": query,
        "leetcode_results": leetcode_results,
        "dsa_results": dsa_results,
        "interview_results": interview_results,
        "coding_results": coding_results,
        "system_design_results": system_design_results,
        "total_results": total_results,
    }
    return render(request, "dashboard/search.html", context)


@login_required
def settings_view(request: HttpRequest) -> HttpResponse:
    user = request.user

    if request.method == "POST":
        form_type = request.POST.get("form_type")

        if form_type == "profile":
            profile_form = ProfileForm(request.POST, instance=user)
            password_form = ChangePasswordForm(user=user)
            if profile_form.is_valid():
                profile_form.save()
                messages.success(request, "Profile updated successfully.")
                return redirect("dashboard:settings")
        elif form_type == "password":
            profile_form = ProfileForm(instance=user)
            password_form = ChangePasswordForm(user=user, data=request.POST)
            if password_form.is_valid():
                password_form.save()
                update_session_auth_hash(request, user)
                messages.success(request, "Password changed successfully.")
                return redirect("dashboard:settings")
        else:
            profile_form = ProfileForm(instance=user)
            password_form = ChangePasswordForm(user=user)
    else:
        profile_form = ProfileForm(instance=user)
        password_form = ChangePasswordForm(user=user)

    context: dict[str, object] = {
        "profile_form": profile_form,
        "password_form": password_form,
    }
    return render(request, "dashboard/settings.html", context)
