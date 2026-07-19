from django.urls import path

from . import views

app_name = "coding_questions"

urlpatterns = [
    path("", views.coding_list_view, name="list"),
]
