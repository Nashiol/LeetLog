import uuid

from django.conf import settings
from django.db import models


class LeetCodeProblem(models.Model):
    DIFFICULTY_CHOICES = [
        ("easy", "Easy"),
        ("medium", "Medium"),
        ("hard", "Hard"),
    ]

    STATUS_CHOICES = [
        ("in_progress", "In Progress"),
        ("due_for_review", "Due for Review"),
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
        related_name="leetcode_problems",
    )
    problem_number = models.IntegerField()
    question = models.CharField(max_length=255)
    problem_link = models.URLField()
    solution_link = models.URLField()
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES)
    programming_language = models.CharField(max_length=50)
    notes = models.TextField(blank=True)
    date_solved = models.DateField()
    next_review_date = models.DateField()
    repetition_count = models.IntegerField(default=0)
    ease_factor = models.FloatField(default=2.5)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="in_progress",
    )
    tags = models.ManyToManyField("tags.Tag", blank=True, related_name="leetcode_problems")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"#{self.problem_number} - {self.question}"
