from django.contrib import admin
from django.urls import path

from rest_framework.routers import DefaultRouter

from .views import game_detail, make_move, AllGamesList
from .api import GameViewSet, MoveViewSet, GamesForUserList, MovesForGame, make_move, is_my_move, forfeit_game

router = DefaultRouter()
router.register("games", GameViewSet)
router.register("moves", MoveViewSet)

urlpatterns = [
    path("details/<int:id>/",
         game_detail,
         name="gameplay_detail"),
    path("make_move/<int:id>/",
         make_move,
         name="gameplay_make_move"),
    path("all_games", AllGamesList.as_view()),
    path("test/<id>/", GamesForUserList.as_view()),
    path("moves_for_game/<id>/", MovesForGame.as_view()),
    path("is_my_move/", is_my_move),
    path("make_move1/", make_move, name="make_move"),
    path("forfeit_game/", forfeit_game),

] + router.urls
