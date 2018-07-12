from django.shortcuts import get_object_or_404
from rest_framework import permissions, generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from gameplay.serializers import GameSerializer
from gameplay.models import Game
from .models import Invitation
from .serializers import InvitationSerializer, CreateInvitationSerializer


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


@api_view(['GET'])
def my_invitations(request):
    if request.method == 'GET':
        invitations = request.user.invitation_sent.all()
        serializer = InvitationSerializer(invitations, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
def new_invitation2(request):
    if request.method == "POST":
        request.data["from_user"] = int(request.user.id)
        serializer = CreateInvitationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            invitation = get_object_or_404(Invitation, pk=serializer.data["id"])
            serializer = InvitationSerializer(invitation)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.error_messages, status=status.HTTP_400_BAD_REQUEST)
    return Response(request.data, status=status.HTTP_406_NOT_ACCEPTABLE)


@api_view(['POST'])
def invitation_action(request):
    if request.method == 'POST':
        invitation = get_object_or_404(Invitation, pk=request.data["id"])
        action = request.data["action"]
        if not invitation.is_valid_action(action):
            return Response(request.data, status=status.HTTP_406_NOT_ACCEPTABLE)

        # Invitation accepted. Create new game. Delete invitation
        if action == "ACCEPT":
            if not request.user == invitation.to_user:
                return Response(request.data, status=status.HTTP_401_UNAUTHORIZED)

            game = Game.objects.create(
                first_player=invitation.to_user,
                second_player=invitation.from_user,
            )
            invitation.delete()
            serializer = GameSerializer(game)
            return Response(serializer.data, status=status.HTTP_200_OK)

        # Invitation declined. Delete invitation.
        if action == "DECLINE":
            if not request.user == invitation.to_user:
                return Response(request.data, status=status.HTTP_401_UNAUTHORIZED)

            invitation.delete()
            return Response(True, status=status.HTTP_200_OK)

        # Invitation canceled by user who invited. Delete invitation.
        if action == "CANCEL":
            if not request.user == invitation.from_user:
                return Response(request.data, status=status.HTTP_401_UNAUTHORIZED)

            invitation.delete()
            return Response(True, status=status.HTTP_200_OK)

        return Response(request.data, status=status.HTTP_406_NOT_ACCEPTABLE)