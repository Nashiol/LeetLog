from django import forms

from .models import CodingQuestion


class CodingQuestionForm(forms.ModelForm):
    class Meta:
        model = CodingQuestion
        fields = [
            "question",
            "repository_link",
            "notes",
            "date_created",
        ]
        widgets = {
            "question": forms.Textarea(attrs={
                "class": "form-input",
                "rows": 4,
                "placeholder": "Describe the coding challenge...",
            }),
            "repository_link": forms.URLInput(attrs={
                "class": "form-input",
                "placeholder": "https://github.com/...",
            }),
            "notes": forms.HiddenInput(attrs={
                "id": "notes-hidden",
            }),
            "date_created": forms.DateInput(attrs={
                "class": "form-input",
                "type": "date",
            }),
        }
