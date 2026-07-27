from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.http import HttpRequest, HttpResponse
from django.shortcuts import get_object_or_404, redirect, render

from coding_questions.models import CodingQuestion
from dsa.models import DSAConcept
from interview_questions.models import InterviewQuestion
from jobs.models import JobApplication
from leetcode.models import LeetCodeProblem
from system_design.models import SystemDesign

from .forms import TagFolderForm, TagForm
from .models import Tag, TagFolder


@login_required
def list_view(request: HttpRequest) -> HttpResponse:
    user = request.user
    folders = TagFolder.objects.filter(user=user).prefetch_related("tags")
    folder_form = TagFolderForm()
    tag_form = TagForm(user=user)
    return render(request, "tags/list.html", {
        "folders": folders,
        "folder_form": folder_form,
        "tag_form": tag_form,
    })


@login_required
def folder_create(request: HttpRequest) -> HttpResponse:
    if request.method != "POST":
        return redirect("tags:list")
    form = TagFolderForm(request.POST)
    if form.is_valid():
        folder = form.save(commit=False)
        folder.user = request.user
        folder.save()
        messages.success(request, f'Folder "{folder.name}" created.')
    return redirect("tags:list")


@login_required
def folder_edit(request: HttpRequest, pk: str) -> HttpResponse:
    user = request.user
    folder = get_object_or_404(TagFolder, pk=pk, user=user)
    if request.method == "POST":
        form = TagFolderForm(request.POST, instance=folder)
        if form.is_valid():
            form.save()
            messages.success(request, f'Folder "{folder.name}" updated.')
            return redirect("tags:list")
    else:
        form = TagFolderForm(instance=folder)
    return render(request, "tags/folder_edit.html", {
        "folder": folder,
        "form": form,
    })


@login_required
def folder_delete(request: HttpRequest, pk: str) -> HttpResponse:
    user = request.user
    folder = get_object_or_404(TagFolder, pk=pk, user=user)
    if request.method == "POST":
        name = folder.name
        folder.delete()
        messages.success(request, f'Folder "{name}" deleted.')
    return redirect("tags:list")


@login_required
def tag_create(request: HttpRequest) -> HttpResponse:
    if request.method != "POST":
        return redirect("tags:list")
    form = TagForm(request.POST, user=request.user)
    if form.is_valid():
        tag = form.save(commit=False)
        tag.user = request.user
        tag.save()
        messages.success(request, f'Tag "{tag.name}" created.')
    return redirect("tags:list")


@login_required
def tag_edit(request: HttpRequest, pk: str) -> HttpResponse:
    user = request.user
    tag = get_object_or_404(Tag, pk=pk, user=user)
    if request.method == "POST":
        form = TagForm(request.POST, instance=tag, user=user)
        if form.is_valid():
            form.save()
            messages.success(request, f'Tag "{tag.name}" updated.')
            return redirect("tags:list")
    else:
        form = TagForm(instance=tag, user=user)
    return render(request, "tags/tag_edit.html", {
        "tag": tag,
        "form": form,
    })


@login_required
def tag_delete(request: HttpRequest, pk: str) -> HttpResponse:
    user = request.user
    tag = get_object_or_404(Tag, pk=pk, user=user)
    if request.method == "POST":
        name = tag.name
        tag.delete()
        messages.success(request, f'Tag "{name}" deleted.')
    return redirect("tags:list")


@login_required
def tag_detail(request: HttpRequest, pk: str) -> HttpResponse:
    user = request.user
    tag = get_object_or_404(Tag, pk=pk, user=user)

    leetcode_results = list(
        LeetCodeProblem.objects.filter(user=user, tags=tag).order_by("-created_at")[:20]
    )
    dsa_results = list(
        DSAConcept.objects.filter(user=user, tags=tag).order_by("-created_at")[:20]
    )
    interview_results = list(
        InterviewQuestion.objects.filter(user=user, tags=tag).order_by("-created_at")[:20]
    )
    coding_results = list(
        CodingQuestion.objects.filter(user=user, tags=tag).order_by("-created_at")[:20]
    )
    system_design_results = list(
        SystemDesign.objects.filter(user=user, tags=tag).order_by("-created_at")[:20]
    )
    job_results = list(
        JobApplication.objects.filter(user=user, tags=tag).order_by("-created_at")[:20]
    )

    total = (
        len(leetcode_results)
        + len(dsa_results)
        + len(interview_results)
        + len(coding_results)
        + len(system_design_results)
        + len(job_results)
    )

    return render(request, "tags/detail.html", {
        "tag": tag,
        "leetcode_results": leetcode_results,
        "dsa_results": dsa_results,
        "interview_results": interview_results,
        "coding_results": coding_results,
        "system_design_results": system_design_results,
        "job_results": job_results,
        "total": total,
    })
