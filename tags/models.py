import uuid

from django.conf import settings
from django.db import models


class TagFolder(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="tag_folders",
    )
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]
        unique_together = ["user", "name"]

    def __str__(self) -> str:
        return self.name


class Tag(models.Model):
    COLOR_PRESETS = [
        "#EAB308",
        "#60A5FA",
        "#4ADE80",
        "#F87171",
        "#A78BFA",
        "#F472B6",
        "#34D399",
        "#FB923C",
    ]

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="tags",
    )
    folder = models.ForeignKey(
        TagFolder,
        on_delete=models.CASCADE,
        related_name="tags",
    )
    name = models.CharField(max_length=100)
    color = models.CharField(max_length=7, default="#EAB308")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["folder__name", "name"]
        unique_together = ["user", "folder", "name"]

    def __str__(self) -> str:
        return f"{self.folder.name} / {self.name}"
