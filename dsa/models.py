import uuid

from django.conf import settings
from django.db import models


class DSAConcept(models.Model):
    MASTERY_CHOICES = [
        ("not_started", "Not Started"),
        ("learning", "Learning"),
        ("comfortable", "Comfortable"),
        ("mastered", "Mastered"),
    ]

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="dsa_concepts",
    )
    topic = models.CharField(max_length=255)
    resource_used = models.CharField(max_length=255)
    notes = models.TextField(blank=True)
    mastery_level = models.CharField(
        max_length=20,
        choices=MASTERY_CHOICES,
        default="not_started",
    )
    date_studied = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return self.topic
