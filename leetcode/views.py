from datetime import date

from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from django.http import HttpRequest, HttpResponse
from django.shortcuts import get_object_or_404, redirect, render

from .forms import LeetCodeProblemForm, ReviewForm
from .models import LeetCodeProblem
from .sm2 import calculate_next_review


@login_required
def leetcode_list_view(request: HttpRequest) -> HttpResponse:
    user = request.user
    problems = LeetCodeProblem.objects.filter(user=user)

    difficulty = request.GET.get("difficulty")
    if difficulty in ("easy", "medium", "hard"):
        problems = problems.filter(difficulty=difficulty)

    query = request.GET.get("q")
    if query:
        problems = problems.filter(
            Q(question__icontains=query)
            | Q(problem_number__icontains=query)
        )

    context: dict[str, object] = {
        "problems": problems,
        "current_difficulty": difficulty or "",
        "query": query or "",
    }
    return render(request, "leetcode/list.html", context)


@login_required
def leetcode_create_view(request: HttpRequest) -> HttpResponse:
    if request.method == "POST":
        form = LeetCodeProblemForm(request.POST)
        if form.is_valid():
            problem = form.save(commit=False)
            problem.user = request.user
            problem.next_review_date = date.today()
            problem.status = "in_progress"
            problem.save()
            messages.success(request, "Problem added successfully.")
            return redirect("leetcode:list")
    else:
        form = LeetCodeProblemForm()

    return render(request, "leetcode/new.html", {"form": form})


@login_required
def leetcode_detail_view(request: HttpRequest, pk: str) -> HttpResponse:
    problem = get_object_or_404(
        LeetCodeProblem,
        pk=pk,
        user=request.user,
    )
    review_form = ReviewForm()
    context: dict[str, object] = {
        "problem": problem,
        "review_form": review_form,
    }
    return render(request, "leetcode/detail.html", context)


@login_required
def leetcode_edit_view(request: HttpRequest, pk: str) -> HttpResponse:
    problem = get_object_or_404(
        LeetCodeProblem,
        pk=pk,
        user=request.user,
    )
    if request.method == "POST":
        form = LeetCodeProblemForm(request.POST, instance=problem)
        if form.is_valid():
            form.save()
            messages.success(request, "Problem updated successfully.")
            return redirect("leetcode:detail", pk=problem.pk)
    else:
        form = LeetCodeProblemForm(instance=problem)

    context: dict[str, object] = {
        "form": form,
        "problem": problem,
    }
    return render(request, "leetcode/edit.html", context)


@login_required
def leetcode_delete_view(request: HttpRequest, pk: str) -> HttpResponse:
    problem = get_object_or_404(
        LeetCodeProblem,
        pk=pk,
        user=request.user,
    )
    if request.method == "POST":
        problem.delete()
        messages.success(request, "Problem deleted.")
        return redirect("leetcode:list")

    return redirect("leetcode:detail", pk=problem.pk)


@login_required
def leetcode_review_view(request: HttpRequest, pk: str) -> HttpResponse:
    problem = get_object_or_404(
        LeetCodeProblem,
        pk=pk,
        user=request.user,
    )
    if request.method == "POST":
        form = ReviewForm(request.POST)
        if form.is_valid():
            rating = form.cleaned_data["rating"]
            result = calculate_next_review(
                current_ease_factor=problem.ease_factor,
                repetition_count=problem.repetition_count,
                rating=rating,
            )
            problem.next_review_date = result.next_review_date
            problem.ease_factor = result.new_ease_factor
            problem.repetition_count = result.new_repetition_count
            problem.status = result.new_status
            problem.save()
            messages.success(request, "Review recorded.")

    return redirect("leetcode:detail", pk=problem.pk)
