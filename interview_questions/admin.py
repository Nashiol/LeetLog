from django.contrib import admin

from .models import InterviewQuestion


@admin.register(InterviewQuestion)
class InterviewQuestionAdmin(admin.ModelAdmin):
    list_display = [
        "question",
        "user",
        "created_at",
    ]
    search_fields = ["question", "answer"]
    readonly_fields = ["created_at"]
