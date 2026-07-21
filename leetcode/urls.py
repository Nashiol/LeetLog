from django.urls import path

from . import views

app_name = "leetcode"

urlpatterns = [
    path("", views.leetcode_list_view, name="list"),
    path("new/", views.leetcode_create_view, name="create"),
    path("<uuid:pk>/", views.leetcode_detail_view, name="detail"),
    path("<uuid:pk>/edit/", views.leetcode_edit_view, name="edit"),
    path("<uuid:pk>/delete/", views.leetcode_delete_view, name="delete"),
    path("<uuid:pk>/review/", views.leetcode_review_view, name="review"),
]
