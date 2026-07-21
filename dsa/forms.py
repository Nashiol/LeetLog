from django import forms

from .models import DSAConcept


class DSAConceptForm(forms.ModelForm):
    class Meta:
        model = DSAConcept
        fields = [
            "topic",
            "resource_used",
            "notes",
            "mastery_level",
            "date_studied",
        ]
        widgets = {
            "topic": forms.TextInput(attrs={
                "class": "form-input",
                "placeholder": "e.g. Binary Search, Dynamic Programming",
            }),
            "resource_used": forms.TextInput(attrs={
                "class": "form-input",
                "placeholder": "e.g. NeetCode, YouTube, Cracking the Coding Interview",
            }),
            "notes": forms.HiddenInput(attrs={
                "id": "notes-hidden",
            }),
            "mastery_level": forms.Select(attrs={
                "class": "form-input",
            }),
            "date_studied": forms.DateInput(attrs={
                "class": "form-input",
                "type": "date",
            }),
        }
