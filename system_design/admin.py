from django.contrib import admin

from .models import SystemDesign


@admin.register(SystemDesign)
class SystemDesignAdmin(admin.ModelAdmin):
    list_display = [
        "question",
        "company",
        "user",
        "created_at",
    ]
    list_filter = ["company"]
    search_fields = ["question", "company"]
    readonly_fields = ["created_at"]
