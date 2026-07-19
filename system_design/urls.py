from django.urls import path

from . import views

app_name = "system_design"

urlpatterns = [
    path("", views.system_design_list_view, name="list"),
]
