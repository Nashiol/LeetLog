from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.http import HttpRequest, HttpResponse
from django.shortcuts import get_object_or_404, redirect, render

from .forms import InterviewQuestionForm
from .models import InterviewQuestion


@login_required
def interview_list_view(request: HttpRequest) -> HttpResponse:
    questions = InterviewQuestion.objects.filter(user=request.user)
    context: dict[str, object] = {
        "questions": questions,
    }
    return render(request, "interview_questions/list.html", context)


@login_required
def interview_create_view(request: HttpRequest) -> HttpResponse:
    if request.method == "POST":
        form = InterviewQuestionForm(request.POST)
        if form.is_valid():
            question = form.save(commit=False)
            question.user = request.user
            question.save()
            messages.success(request, "Interview question added successfully.")
            return redirect("interview_questions:list")
    else:
        form = InterviewQuestionForm()

    return render(request, "interview_questions/new.html", {"form": form})


@login_required
def interview_detail_view(request: HttpRequest, pk: str) -> HttpResponse:
    question = get_object_or_404(
        InterviewQuestion,
        pk=pk,
        user=request.user,
    )
    return render(request, "interview_questions/detail.html", {"question": question})


@login_required
def interview_edit_view(request: HttpRequest, pk: str) -> HttpResponse:
    question = get_object_or_404(
        InterviewQuestion,
        pk=pk,
        user=request.user,
    )
    if request.method == "POST":
        form = InterviewQuestionForm(request.POST, instance=question)
        if form.is_valid():
            form.save()
            messages.success(request, "Interview question updated successfully.")
            return redirect("interview_questions:detail", pk=question.pk)
    else:
        form = InterviewQuestionForm(instance=question)

    context: dict[str, object] = {
        "form": form,
        "question": question,
    }
    return render(request, "interview_questions/edit.html", context)


@login_required
def interview_delete_view(request: HttpRequest, pk: str) -> HttpResponse:
    question = get_object_or_404(
        InterviewQuestion,
        pk=pk,
        user=request.user,
    )
    if request.method == "POST":
        question.delete()
        messages.success(request, "Interview question deleted.")
        return redirect("interview_questions:list")

    return redirect("interview_questions:detail", pk=question.pk)
