from django.contrib import admin

from .models import DSAConcept


@admin.register(DSAConcept)
class DSAConceptAdmin(admin.ModelAdmin):
    list_display = [
        "topic",
        "resource_used",
        "mastery_level",
        "date_studied",
        "user",
    ]
    list_filter = ["mastery_level"]
    search_fields = ["topic", "resource_used"]
    readonly_fields = ["created_at"]
