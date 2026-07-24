from django.contrib import admin

from .models import JobApplication


@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    list_display = [
        "job_title",
        "company",
        "job_status",
        "job_type",
        "job_source",
        "date_applied",
        "user",
    ]
    list_filter = ["job_status", "job_type", "job_source"]
    search_fields = ["job_title", "company"]
