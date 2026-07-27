import uuid

from django.conf import settings
from django.db import models


class InterviewQuestion(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="interview_questions",
    )
    question = models.CharField(max_length=255)
    answer = models.TextField()
    notes = models.TextField(blank=True)
    tags = models.ManyToManyField("tags.Tag", blank=True, related_name="interview_questions")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return self.question
