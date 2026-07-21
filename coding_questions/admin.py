from django.contrib import admin

from .models import CodingQuestion


@admin.register(CodingQuestion)
class CodingQuestionAdmin(admin.ModelAdmin):
    list_display = [
        "question",
        "repository_link",
        "date_created",
        "user",
    ]
    search_fields = ["question"]
    readonly_fields = ["created_at"]
