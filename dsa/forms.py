from django import forms

from .models import DSAConcept


class DSAConceptForm(forms.ModelForm):
    def __init__(self, *args: object, user: object = None, **kwargs: object) -> None:
        super().__init__(*args, **kwargs)
        if user:
            from tags.models import Tag
            self.fields["tags"].queryset = Tag.objects.filter(user=user)

    class Meta:
        model = DSAConcept
        fields = [
            "topic",
            "resource_used",
            "tags",
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
            "tags": forms.SelectMultiple(attrs={
                "class": "form-input",
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
