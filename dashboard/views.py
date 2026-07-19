from datetime import date

from django.contrib.auth.decorators import login_required
from django.http import HttpRequest, HttpResponse
from django.shortcuts import render


@login_required
def dashboard_view(request: HttpRequest) -> HttpResponse:
    user = request.user

    due_today_count: int = 0
    total_problems: int = 0
    easy_count: int = 0
    medium_count: int = 0
    hard_count: int = 0
    mastered_count: int = 0
    streak: int = 0
    recent_activity: list[dict[str, str]] = []

    context: dict[str, object] = {
        "due_today_count": due_today_count,
        "total_problems": total_problems,
        "easy_count": easy_count,
        "medium_count": medium_count,
        "hard_count": hard_count,
        "mastered_count": mastered_count,
        "streak": streak,
        "recent_activity": recent_activity,
        "today": date.today(),
    }

    return render(request, "dashboard/dashboard.html", context)
