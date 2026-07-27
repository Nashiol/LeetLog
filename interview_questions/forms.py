from django import forms

from .models import InterviewQuestion


class InterviewQuestionForm(forms.ModelForm):
    def __init__(self, *args: object, user: object = None, **kwargs: object) -> None:
        super().__init__(*args, **kwargs)
        if user:
            from tags.models import Tag
            self.fields["tags"].queryset = Tag.objects.filter(user=user)

    class Meta:
        model = InterviewQuestion
        fields = [
            "question",
            "answer",
            "tags",
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
            "tags": forms.SelectMultiple(attrs={
                "class": "form-input",
            }),
            "notes": forms.HiddenInput(attrs={
                "id": "notes-hidden",
            }),
        }
