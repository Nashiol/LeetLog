from datetime import date

from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.http import HttpRequest, HttpResponse
from django.shortcuts import get_object_or_404, redirect, render

from .forms import JobApplicationForm
from .models import JobApplication


@login_required
def job_list_view(request: HttpRequest) -> HttpResponse:
    user = request.user
    jobs = JobApplication.objects.filter(user=user)

    status = request.GET.get("status")
    if status in ("draft", "applied", "interview", "offer", "rejected", "expired", "archived"):
        jobs = jobs.filter(job_status=status)

    context: dict[str, object] = {
        "jobs": jobs,
        "current_status": status or "",
    }
    return render(request, "jobs/list.html", context)


@login_required
def job_create_view(request: HttpRequest) -> HttpResponse:
    if request.method == "POST":
        form = JobApplicationForm(request.POST)
        if form.is_valid():
            job = form.save(commit=False)
            job.user = request.user

            if job.applied_toggle and not job.date_applied:
                job.job_status = "applied"
                job.date_applied = date.today()

            job.save()
            messages.success(request, "Job application added successfully.")
            return redirect("jobs:list")
    else:
        form = JobApplicationForm()

    return render(request, "jobs/new.html", {"form": form})


@login_required
def job_detail_view(request: HttpRequest, pk: str) -> HttpResponse:
    job = get_object_or_404(
        JobApplication,
        pk=pk,
        user=request.user,
    )
    return render(request, "jobs/detail.html", {"job": job})


@login_required
def job_edit_view(request: HttpRequest, pk: str) -> HttpResponse:
    job = get_object_or_404(
        JobApplication,
        pk=pk,
        user=request.user,
    )
    if request.method == "POST":
        form = JobApplicationForm(request.POST, instance=job)
        if form.is_valid():
            updated = form.save(commit=False)

            if updated.applied_toggle and not updated.date_applied:
                updated.job_status = "applied"
                updated.date_applied = date.today()
            elif not updated.applied_toggle and updated.job_status == "applied":
                updated.job_status = "draft"
                updated.date_applied = None

            updated.save()
            messages.success(request, "Job application updated successfully.")
            return redirect("jobs:detail", pk=job.pk)
    else:
        form = JobApplicationForm(instance=job)

    context: dict[str, object] = {
        "form": form,
        "job": job,
    }
    return render(request, "jobs/edit.html", context)


@login_required
def job_delete_view(request: HttpRequest, pk: str) -> HttpResponse:
    job = get_object_or_404(
        JobApplication,
        pk=pk,
        user=request.user,
    )
    if request.method == "POST":
        job.delete()
        messages.success(request, "Job application deleted.")
        return redirect("jobs:list")

    return redirect("jobs:detail", pk=job.pk)
