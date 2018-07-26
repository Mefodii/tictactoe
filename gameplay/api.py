from django.shortcuts import get_object_or_404

from rest_framework.viewsets import ModelViewSet
from rest_framework import permissions, generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .serializers import GameSerializer, MoveSerializer
from .models import Game, Move
from .prevalidations import move_prevalidation

from tictactoe.tests import write_to_log


class GameViewSet(ModelViewSet):
    queryset = Game.objects.all()
    serializer_class = GameSerializer
    permission_classes = (permissions.IsAuthenticated,)


class MoveViewSet(ModelViewSet):
    queryset = Move.objects.all()
    serializer_class = MoveSerializer
    permission_classes = (permissions.IsAuthenticated,)


class GamesForUserList(generics.ListAPIView):
    serializer_class = GameSerializer

    def get_queryset(self):
        user = int(self.kwargs["id"])
        return Game.objects.games_for_user(user)


class MovesForGame(generics.ListAPIView):
    serializer_class = MoveSerializer

    def get_queryset(self):
        game_id = int(self.kwargs["id"])
        return Game.objects.get(id=game_id).move_set.all()


@api_view(['POST'])
def make_move(request):
    if request.method == 'POST':
        request.data['by_first_player'] = move_prevalidation(request, by_first_player=True)
        serializer = MoveSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_406_NOT_ACCEPTABLE)


@api_view(['GET'])
def is_my_move(request):
    if request.method == 'GET':
        game = get_object_or_404(Game, pk=int(request.GET.get("game","-1")))
        return Response(game.is_users_move(request.user), status=status.HTTP_200_OK)


@api_view(['POST'])
def forfeit_game(request):
    if request.method == 'POST':
        game = get_object_or_404(Game, pk=int(request.data))
        if request.user == game.first_player or request.user == game.second_player:
            if game.status in "FS":
                game.forfeit_game(request.user)
                game.save()
                serializer = GameSerializer(game)
                return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
            return Response(status=status.HTTP_406_NOT_ACCEPTABLE)
        return Response(status=status.HTTP_406_NOT_ACCEPTABLE)