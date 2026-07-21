from typing import Any

from django import forms

from .models import LeetCodeProblem


class LeetCodeProblemForm(forms.ModelForm):
    class Meta:
        model = LeetCodeProblem
        fields = [
            "problem_number",
            "question",
            "problem_link",
            "solution_link",
            "difficulty",
            "programming_language",
            "notes",
            "date_solved",
        ]
        widgets = {
            "problem_number": forms.NumberInput(attrs={
                "class": "form-input",
                "placeholder": "e.g. 1",
            }),
            "question": forms.TextInput(attrs={
                "class": "form-input",
                "placeholder": "e.g. Two Sum",
            }),
            "problem_link": forms.URLInput(attrs={
                "class": "form-input",
                "placeholder": "https://leetcode.com/problems/...",
            }),
            "solution_link": forms.URLInput(attrs={
                "class": "form-input",
                "placeholder": "https://github.com/...",
            }),
            "difficulty": forms.Select(attrs={
                "class": "form-input",
            }),
            "programming_language": forms.TextInput(attrs={
                "class": "form-input",
                "placeholder": "e.g. Python, JavaScript",
            }),
            "notes": forms.HiddenInput(attrs={
                "id": "notes-hidden",
            }),
            "date_solved": forms.DateInput(attrs={
                "class": "form-input",
                "type": "date",
            }),
        }


class ReviewForm(forms.Form):
    RATING_CHOICES = [
        ("hard", "Hard"),
        ("medium", "Medium"),
        ("easy", "Easy"),
        ("very_easy", "Very Easy"),
    ]

    rating = forms.ChoiceField(
        choices=RATING_CHOICES,
        widget=forms.HiddenInput(),
    )
