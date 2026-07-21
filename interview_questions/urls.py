from django.urls import path

from . import views

app_name = "interview_questions"

urlpatterns = [
    path("", views.interview_list_view, name="list"),
    path("new/", views.interview_create_view, name="create"),
    path("<uuid:pk>/", views.interview_detail_view, name="detail"),
    path("<uuid:pk>/edit/", views.interview_edit_view, name="edit"),
    path("<uuid:pk>/delete/", views.interview_delete_view, name="delete"),
]
