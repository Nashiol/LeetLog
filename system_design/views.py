from django.contrib.auth.decorators import login_required
from django.http import HttpRequest, HttpResponse
from django.shortcuts import render


@login_required
def system_design_list_view(request: HttpRequest) -> HttpResponse:
    return render(request, "system_design/list.html")
