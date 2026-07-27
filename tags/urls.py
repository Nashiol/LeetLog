from django.urls import path

from . import views

app_name = "tags"

urlpatterns = [
    path("", views.list_view, name="list"),
    path("folders/new/", views.folder_create, name="folder_create"),
    path("folders/<uuid:pk>/edit/", views.folder_edit, name="folder_edit"),
    path("folders/<uuid:pk>/delete/", views.folder_delete, name="folder_delete"),
    path("new/", views.tag_create, name="tag_create"),
    path("<uuid:pk>/edit/", views.tag_edit, name="tag_edit"),
    path("<uuid:pk>/delete/", views.tag_delete, name="tag_delete"),
    path("<uuid:pk>/", views.tag_detail, name="detail"),
]
