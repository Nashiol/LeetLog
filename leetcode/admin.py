from django.contrib import admin

from .models import LeetCodeProblem


@admin.register(LeetCodeProblem)
class LeetCodeProblemAdmin(admin.ModelAdmin):
    list_display = [
        "problem_number",
        "question",
        "difficulty",
        "programming_language",
        "status",
        "date_solved",
        "next_review_date",
        "user",
    ]
    list_filter = ["difficulty", "status", "programming_language"]
    search_fields = ["question", "problem_number"]
    readonly_fields = ["created_at"]
