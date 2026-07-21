from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.http import HttpRequest, HttpResponse
from django.shortcuts import get_object_or_404, redirect, render

from .forms import CodingQuestionForm
from .models import CodingQuestion


@login_required
def coding_list_view(request: HttpRequest) -> HttpResponse:
    questions = CodingQuestion.objects.filter(user=request.user)
    context: dict[str, object] = {
        "questions": questions,
    }
    return render(request, "coding_questions/list.html", context)


@login_required
def coding_create_view(request: HttpRequest) -> HttpResponse:
    if request.method == "POST":
        form = CodingQuestionForm(request.POST)
        if form.is_valid():
            question = form.save(commit=False)
            question.user = request.user
            question.save()
            messages.success(request, "Coding question added successfully.")
            return redirect("coding_questions:list")
    else:
        form = CodingQuestionForm()

    return render(request, "coding_questions/new.html", {"form": form})


@login_required
def coding_detail_view(request: HttpRequest, pk: str) -> HttpResponse:
    question = get_object_or_404(
        CodingQuestion,
        pk=pk,
        user=request.user,
    )
    return render(request, "coding_questions/detail.html", {"question": question})


@login_required
def coding_edit_view(request: HttpRequest, pk: str) -> HttpResponse:
    question = get_object_or_404(
        CodingQuestion,
        pk=pk,
        user=request.user,
    )
    if request.method == "POST":
        form = CodingQuestionForm(request.POST, instance=question)
        if form.is_valid():
            form.save()
            messages.success(request, "Coding question updated successfully.")
            return redirect("coding_questions:detail", pk=question.pk)
    else:
        form = CodingQuestionForm(instance=question)

    context: dict[str, object] = {
        "form": form,
        "question": question,
    }
    return render(request, "coding_questions/edit.html", context)


@login_required
def coding_delete_view(request: HttpRequest, pk: str) -> HttpResponse:
    question = get_object_or_404(
        CodingQuestion,
        pk=pk,
        user=request.user,
    )
    if request.method == "POST":
        question.delete()
        messages.success(request, "Coding question deleted.")
        return redirect("coding_questions:list")

    return redirect("coding_questions:detail", pk=question.pk)
