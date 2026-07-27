from django import forms

from .models import CodingQuestion


class CodingQuestionForm(forms.ModelForm):
    def __init__(self, *args: object, user: object = None, **kwargs: object) -> None:
        super().__init__(*args, **kwargs)
        if user:
            from tags.models import Tag
            self.fields["tags"].queryset = Tag.objects.filter(user=user)

    class Meta:
        model = CodingQuestion
        fields = [
            "question",
            "repository_link",
            "tags",
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
            "tags": forms.SelectMultiple(attrs={
                "class": "form-input",
            }),
            "notes": forms.HiddenInput(attrs={
                "id": "notes-hidden",
            }),
            "date_created": forms.DateInput(attrs={
                "class": "form-input",
                "type": "date",
            }),
        }
