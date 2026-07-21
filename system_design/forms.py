from django import forms

from .models import SystemDesign


class SystemDesignForm(forms.ModelForm):
    class Meta:
        model = SystemDesign
        fields = [
            "question",
            "company",
            "answer",
            "notes",
        ]
        widgets = {
            "question": forms.Textarea(attrs={
                "class": "form-input",
                "rows": 3,
                "placeholder": "e.g. Design a URL shortener like bit.ly",
            }),
            "company": forms.TextInput(attrs={
                "class": "form-input",
                "placeholder": "e.g. Google, Amazon, Meta",
            }),
            "answer": forms.Textarea(attrs={
                "class": "form-input",
                "rows": 8,
                "placeholder": "Your full answer and approach...",
            }),
            "notes": forms.HiddenInput(attrs={
                "id": "notes-hidden",
            }),
        }
