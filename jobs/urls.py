from django.urls import path

from . import views

app_name = "jobs"

urlpatterns = [
    path("", views.job_list_view, name="list"),
    path("new/", views.job_create_view, name="create"),
    path("<uuid:pk>/", views.job_detail_view, name="detail"),
    path("<uuid:pk>/edit/", views.job_edit_view, name="edit"),
    path("<uuid:pk>/delete/", views.job_delete_view, name="delete"),
]
