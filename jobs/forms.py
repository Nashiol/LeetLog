from django import forms

from .models import JobApplication


class JobApplicationForm(forms.ModelForm):
    class Meta:
        model = JobApplication
        fields = [
            "job_title",
            "company",
            "job_url",
            "job_location",
            "job_type",
            "salary_range",
            "job_source",
            "job_status",
            "due_date",
            "job_description",
            "applied_toggle",
        ]
        widgets = {
            "job_title": forms.TextInput(attrs={
                "class": "form-input",
                "placeholder": "e.g. Software Engineer",
            }),
            "company": forms.TextInput(attrs={
                "class": "form-input",
                "placeholder": "e.g. Google",
            }),
            "job_url": forms.URLInput(attrs={
                "class": "form-input",
                "placeholder": "https://...",
            }),
            "job_location": forms.TextInput(attrs={
                "class": "form-input",
                "placeholder": "e.g. San Francisco, CA or Remote",
            }),
            "job_type": forms.Select(attrs={
                "class": "form-input",
            }),
            "salary_range": forms.Select(attrs={
                "class": "form-input",
            }),
            "job_source": forms.Select(attrs={
                "class": "form-input",
            }),
            "job_status": forms.Select(attrs={
                "class": "form-input",
            }),
            "due_date": forms.DateInput(attrs={
                "class": "form-input",
                "type": "date",
            }),
            "job_description": forms.HiddenInput(attrs={
                "id": "notes-hidden",
            }),
            "applied_toggle": forms.CheckboxInput(attrs={
                "class": "toggle-checkbox",
            }),
        }
