from datetime import date

from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.http import HttpRequest, HttpResponse
from django.shortcuts import get_object_or_404, redirect, render

from .forms import DSAConceptForm
from .models import DSAConcept


@login_required
def dsa_list_view(request: HttpRequest) -> HttpResponse:
    user = request.user
    concepts = DSAConcept.objects.filter(user=user)

    mastery = request.GET.get("mastery")
    if mastery in ("not_started", "learning", "comfortable", "mastered"):
        concepts = concepts.filter(mastery_level=mastery)

    context: dict[str, object] = {
        "concepts": concepts,
        "current_mastery": mastery or "",
    }
    return render(request, "dsa/list.html", context)


@login_required
def dsa_create_view(request: HttpRequest) -> HttpResponse:
    if request.method == "POST":
        form = DSAConceptForm(request.POST)
        if form.is_valid():
            concept = form.save(commit=False)
            concept.user = request.user
            concept.save()
            messages.success(request, "DSA concept added successfully.")
            return redirect("dsa:list")
    else:
        form = DSAConceptForm()

    return render(request, "dsa/new.html", {"form": form})


@login_required
def dsa_detail_view(request: HttpRequest, pk: str) -> HttpResponse:
    concept = get_object_or_404(
        DSAConcept,
        pk=pk,
        user=request.user,
    )
    return render(request, "dsa/detail.html", {"concept": concept})


@login_required
def dsa_edit_view(request: HttpRequest, pk: str) -> HttpResponse:
    concept = get_object_or_404(
        DSAConcept,
        pk=pk,
        user=request.user,
    )
    if request.method == "POST":
        form = DSAConceptForm(request.POST, instance=concept)
        if form.is_valid():
            form.save()
            messages.success(request, "DSA concept updated successfully.")
            return redirect("dsa:detail", pk=concept.pk)
    else:
        form = DSAConceptForm(instance=concept)

    context: dict[str, object] = {
        "form": form,
        "concept": concept,
    }
    return render(request, "dsa/edit.html", context)


@login_required
def dsa_delete_view(request: HttpRequest, pk: str) -> HttpResponse:
    concept = get_object_or_404(
        DSAConcept,
        pk=pk,
        user=request.user,
    )
    if request.method == "POST":
        concept.delete()
        messages.success(request, "DSA concept deleted.")
        return redirect("dsa:list")

    return redirect("dsa:detail", pk=concept.pk)
