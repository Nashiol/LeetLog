from django.urls import path

from . import views

app_name = "dashboard"

urlpatterns = [
    path("", views.dashboard_view, name="dashboard"),
    path("search/", views.search_view, name="search"),
    path("settings/", views.settings_view, name="settings"),
]
