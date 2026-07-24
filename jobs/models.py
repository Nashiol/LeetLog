import uuid

from django.conf import settings
from django.db import models


class JobApplication(models.Model):
    STATUS_CHOICES = [
        ("draft", "Draft"),
        ("applied", "Applied"),
        ("interview", "Interview"),
        ("offer", "Offer"),
        ("rejected", "Rejected"),
        ("expired", "Expired"),
        ("archived", "Archived"),
    ]

    JOB_TYPE_CHOICES = [
        ("full_time", "Full-Time"),
        ("part_time", "Part-Time"),
        ("remote", "Remote"),
    ]

    SALARY_RANGE_CHOICES = [
        ("0-10000", "$0 - $10,000"),
        ("10000-20000", "$10,000 - $20,000"),
        ("20000-30000", "$20,000 - $30,000"),
        ("30000-40000", "$30,000 - $40,000"),
        ("40000-50000", "$40,000 - $50,000"),
        ("50000-60000", "$50,000 - $60,000"),
        ("60000-70000", "$60,000 - $70,000"),
        ("70000-80000", "$70,000 - $80,000"),
        ("80000-90000", "$80,000 - $90,000"),
        ("90000-100000", "$90,000 - $100,000"),
        ("100000-150000", "$100,000 - $150,000"),
        ("150000+", "Greater than $150,000"),
    ]

    SOURCE_CHOICES = [
        ("indeed", "Indeed"),
        ("linkedin", "LinkedIn"),
        ("monster", "Monster"),
        ("glassdoor", "Glassdoor"),
        ("company_career_page", "Company Career Page"),
        ("google", "Google"),
        ("ziprecruiter", "ZipRecruiter"),
        ("jobstreet", "Jobstreet"),
        ("other", "Other"),
    ]

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="job_applications",
    )
    job_title = models.CharField(max_length=255)
    company = models.CharField(max_length=255)
    job_url = models.URLField()
    job_location = models.CharField(max_length=255)
    job_description = models.TextField(blank=True)
    job_status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="draft",
    )
    job_type = models.CharField(
        max_length=20,
        choices=JOB_TYPE_CHOICES,
        default="full_time",
    )
    salary_range = models.CharField(
        max_length=20,
        choices=SALARY_RANGE_CHOICES,
        blank=True,
    )
    job_source = models.CharField(
        max_length=30,
        choices=SOURCE_CHOICES,
        default="other",
    )
    due_date = models.DateField(blank=True, null=True)
    applied_toggle = models.BooleanField(default=False)
    date_applied = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.job_title} — {self.company}"
