from django.urls import path

from . import views

app_name = "interview_questions"

urlpatterns = [
    path("", views.interview_list_view, name="list"),
]
