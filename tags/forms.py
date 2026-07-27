from django import forms

from .models import Tag, TagFolder


class TagFolderForm(forms.ModelForm):
    class Meta:
        model = TagFolder
        fields = ["name"]
        widgets = {
            "name": forms.TextInput(attrs={
                "class": "form-input",
                "placeholder": "e.g. Data Structures, Companies, Topics",
            }),
        }


class TagForm(forms.ModelForm):
    def __init__(self, *args: object, user: object = None, **kwargs: object) -> None:
        super().__init__(*args, **kwargs)
        if user:
            self.fields["folder"].queryset = TagFolder.objects.filter(user=user)

    class Meta:
        model = Tag
        fields = ["folder", "name", "color"]
        widgets = {
            "folder": forms.Select(attrs={
                "class": "form-input",
            }),
            "name": forms.TextInput(attrs={
                "class": "form-input",
                "placeholder": "e.g. Arrays, Google, Dynamic Programming",
            }),
            "color": forms.TextInput(attrs={
                "class": "form-input",
                "type": "color",
            }),
        }
