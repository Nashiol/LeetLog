from django.contrib import admin

from .models import Tag, TagFolder


class TagInline(admin.TabularInline):
    model = Tag
    extra = 0
    fields = ["name", "color"]


@admin.register(TagFolder)
class TagFolderAdmin(admin.ModelAdmin):
    list_display = ["name", "user", "created_at"]
    list_filter = ["user"]
    search_fields = ["name"]
    inlines = [TagInline]


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ["name", "folder", "user", "color", "created_at"]
    list_filter = ["folder", "user"]
    search_fields = ["name"]
