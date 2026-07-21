from django.urls import path

from . import views

app_name = "coding_questions"

urlpatterns = [
    path("", views.coding_list_view, name="list"),
    path("new/", views.coding_create_view, name="create"),
    path("<uuid:pk>/", views.coding_detail_view, name="detail"),
    path("<uuid:pk>/edit/", views.coding_edit_view, name="edit"),
    path("<uuid:pk>/delete/", views.coding_delete_view, name="delete"),
]
