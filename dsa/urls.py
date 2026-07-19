from django.urls import path

from . import views

app_name = "dsa"

urlpatterns = [
    path("", views.dsa_list_view, name="list"),
]
