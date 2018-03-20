from django.contrib import admin
from django.urls import path

from .views import game_detail, make_move

urlpatterns = [
    path("details/<int:id>/",
         game_detail,
         name="gameplay_detail"),
    path("make_move/<int:id>/",
         make_move,
         name="gameplay_make_move")

]
