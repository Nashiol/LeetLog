from django.contrib.auth.models import AbstractUser
from django.db import models

from .managers import UserManager


class User(AbstractUser):
    username = models.CharField(max_length=150, blank=True, null=True, unique=True)
    email = models.EmailField(unique=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]  # makes `createsuperuser` prompt for username too.
                                     # first_name/last_name for normal users are enforced
                                     # inside the manager instead, since that signup path
                                     # doesn't go through this command.

    objects = UserManager()

    def __str__(self):
        return self.email

    def get_full_name(self):
        full_name = f"{self.first_name} {self.last_name}".strip()
        return full_name or self.email

    def get_short_name(self):
        return self.first_name or self.email