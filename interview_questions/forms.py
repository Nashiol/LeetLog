from django import forms

from .models import InterviewQuestion


class InterviewQuestionForm(forms.ModelForm):
    class Meta:
        model = InterviewQuestion
        fields = [
            "question",
            "answer",
            "notes",
        ]
        widgets = {
            "question": forms.TextInput(attrs={
                "class": "form-input",
                "placeholder": "e.g. Tell me about a time you faced a conflict",
            }),
            "answer": forms.Textarea(attrs={
                "class": "form-input",
                "rows": 6,
                "placeholder": "Your model answer...",
            }),
            "notes": forms.HiddenInput(attrs={
                "id": "notes-hidden",
            }),
        }
