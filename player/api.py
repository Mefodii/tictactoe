from django.shortcuts import get_object_or_404
from rest_framework import permissions, generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from gameplay.serializers import GameSerializer, MoveSerializer
from gameplay.models import Game, Move
from .models import Invitation
from .serializers import InvitationSerializer


@api_view(['GET'])
def active_games_for_user(request):
    if request.method == 'GET':
        my_games = Game.objects.games_for_user(request.user)
        active_games = my_games.active()
        serializer = GameSerializer(active_games, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
def finished_games_for_user(request):
    if request.method == 'GET':
        my_games = Game.objects.games_for_user(request.user)
        active_games = my_games.active()
        finished_games = my_games.difference(active_games)
        serializer = GameSerializer(finished_games, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
def invitations_for_user(request):
    if request.method == 'GET':
        invitations = request.user.invitations_received.all()
        serializer = InvitationSerializer(invitations, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
def invitation_action(request):
    if request.method == 'POST':
        invitation = get_object_or_404(Invitation, pk=request.data["id"])
        if not request.user == invitation.to_user:
            return Response(request.data, status=status.HTTP_401_UNAUTHORIZED)
        if request.method == "POST":
            if request.data["accept"]:
                game = Game.objects.create(
                    first_player=invitation.to_user,
                    second_player=invitation.from_user,
                )
                invitation.delete()
                serializer = GameSerializer(game)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                invitation.delete()
                return Response(True, status=status.HTTP_200_OK)