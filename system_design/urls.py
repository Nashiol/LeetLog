from django.urls import path

from . import views

app_name = "system_design"

urlpatterns = [
    path("", views.system_design_list_view, name="list"),
    path("new/", views.system_design_create_view, name="create"),
    path("<uuid:pk>/", views.system_design_detail_view, name="detail"),
    path("<uuid:pk>/edit/", views.system_design_edit_view, name="edit"),
    path("<uuid:pk>/delete/", views.system_design_delete_view, name="delete"),
]
