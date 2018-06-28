from django.shortcuts import get_object_or_404

from rest_framework.viewsets import ModelViewSet
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
        if serializer.is_valid():

            return Response(serializer.data, status=status.HTTP_201_CREATED)