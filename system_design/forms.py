from django import forms

from .models import SystemDesign


class SystemDesignForm(forms.ModelForm):
    def __init__(self, *args: object, user: object = None, **kwargs: object) -> None:
        super().__init__(*args, **kwargs)
        if user:
            from tags.models import Tag
            self.fields["tags"].queryset = Tag.objects.filter(user=user)

    class Meta:
        model = SystemDesign
        fields = [
            "question",
            "company",
            "tags",
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
            "tags": forms.SelectMultiple(attrs={
                "class": "form-input",
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
