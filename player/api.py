from rest_framework import permissions, generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from gameplay.serializers import GameSerializer, MoveSerializer
from gameplay.models import Game, Move


@api_view(['GET'])
def active_games_for_user(request):
    if request.method == 'GET':
        my_games = Game.objects.games_for_user(request.user)
        active_games = my_games.active()
        serializer = GameSerializer(active_games, many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
def finished_games_for_user(request):
    if request.method == 'GET':
        my_games = Game.objects.games_for_user(request.user)
        active_games = my_games.active()
        finished_games = my_games.difference(active_games)
        serializer = GameSerializer(finished_games, many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)