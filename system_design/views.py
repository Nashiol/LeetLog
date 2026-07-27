from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.http import HttpRequest, HttpResponse
from django.shortcuts import get_object_or_404, redirect, render

from .forms import SystemDesignForm
from .models import SystemDesign


@login_required
def system_design_list_view(request: HttpRequest) -> HttpResponse:
    questions = SystemDesign.objects.filter(user=request.user)
    context: dict[str, object] = {
        "questions": questions,
    }
    return render(request, "system_design/list.html", context)


@login_required
def system_design_create_view(request: HttpRequest) -> HttpResponse:
    if request.method == "POST":
        form = SystemDesignForm(request.POST, user=request.user)
        if form.is_valid():
            question = form.save(commit=False)
            question.user = request.user
            question.save()
            form.save_m2m()
            messages.success(request, "System design question added successfully.")
            return redirect("system_design:list")
    else:
        form = SystemDesignForm(user=request.user)

    return render(request, "system_design/new.html", {"form": form})


@login_required
def system_design_detail_view(request: HttpRequest, pk: str) -> HttpResponse:
    question = get_object_or_404(
        SystemDesign,
        pk=pk,
        user=request.user,
    )
    return render(request, "system_design/detail.html", {"question": question})


@login_required
def system_design_edit_view(request: HttpRequest, pk: str) -> HttpResponse:
    question = get_object_or_404(
        SystemDesign,
        pk=pk,
        user=request.user,
    )
    if request.method == "POST":
        form = SystemDesignForm(request.POST, instance=question, user=request.user)
        if form.is_valid():
            form.save()
            messages.success(request, "System design question updated successfully.")
            return redirect("system_design:detail", pk=question.pk)
    else:
        form = SystemDesignForm(instance=question, user=request.user)

    context: dict[str, object] = {
        "form": form,
        "question": question,
    }
    return render(request, "system_design/edit.html", context)


@login_required
def system_design_delete_view(request: HttpRequest, pk: str) -> HttpResponse:
    question = get_object_or_404(
        SystemDesign,
        pk=pk,
        user=request.user,
    )
    if request.method == "POST":
        question.delete()
        messages.success(request, "System design question deleted.")
        return redirect("system_design:list")

    return redirect("system_design:detail", pk=question.pk)
