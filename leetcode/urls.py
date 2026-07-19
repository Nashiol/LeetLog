from django.urls import path

from . import views

app_name = "leetcode"

urlpatterns = [
    path("", views.leetcode_list_view, name="list"),
]
