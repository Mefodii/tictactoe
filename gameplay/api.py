from rest_framework.viewsets import ModelViewSet
from rest_framework import permissions, generics

from .serializers import GameSerializer, MoveSerializer
from .models import Game, Move


class GameViewSet(ModelViewSet):
    queryset = Game.objects.all()
    serializer_class = GameSerializer
    permission_classes = (permissions.IsAuthenticated,)


class MoveViewSet(ModelViewSet):
    queryset = Move.objects.all()
    serializer_class = MoveSerializer
    permission_classes = (permissions.IsAuthenticated,)


class GamesForUserList(generics.ListAPIView):
    serializer_class =  GameSerializer

    def get_queryset(self):
        user = int(self.kwargs["id"])
        return Game.objects.games_for_user(user)