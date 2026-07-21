from datetime import date

from django.http import HttpRequest

from leetcode.models import LeetCodeProblem


def notifications_context(request: HttpRequest) -> dict[str, object]:
    if request.user.is_authenticated:
        due_problems = list(
            LeetCodeProblem.objects.filter(
                user=request.user,
                next_review_date__lte=date.today(),
            )
            .exclude(status="mastered")
            .order_by("next_review_date")[:10]
        )
        return {
            "notification_count": len(due_problems),
            "due_problems": due_problems,
        }
    return {"notification_count": 0, "due_problems": []}
