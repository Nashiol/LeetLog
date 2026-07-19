from django.contrib.auth.decorators import login_required
from django.http import HttpRequest, HttpResponse
from django.shortcuts import render


@login_required
def coding_list_view(request: HttpRequest) -> HttpResponse:
    return render(request, "coding_questions/list.html")
