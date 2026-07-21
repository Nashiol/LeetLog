from django.urls import path

from . import views

app_name = "dsa"

urlpatterns = [
    path("", views.dsa_list_view, name="list"),
    path("new/", views.dsa_create_view, name="create"),
    path("<uuid:pk>/", views.dsa_detail_view, name="detail"),
    path("<uuid:pk>/edit/", views.dsa_edit_view, name="edit"),
    path("<uuid:pk>/delete/", views.dsa_delete_view, name="delete"),
]
