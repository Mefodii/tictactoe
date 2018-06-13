from rest_framework.viewsets import ModelViewSet
from rest_framework import permissions, generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required

from .serializers import UserSerializer
from django.contrib.auth.models import User


class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)


@api_view(['GET'])
@login_required
def current_user(request):
    if request.method == 'GET':
        # user = get_object_or_404(User, pk=id)
        serializer = UserSerializer(request.user)
        # if serializer.is_valid():
        #     serializer.save()
        #     return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.data, status=status.HTTP_200_OK)