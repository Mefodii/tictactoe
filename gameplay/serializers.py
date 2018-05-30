from rest_framework import serializers
from .models import Game, Move


class GameSerializer(serializers.ModelSerializer):

    class Meta:
        model = Game
        fields = '__all__'


class MoveSerializer(serializers.ModelSerializer):

    class Meta:
        model = Move
        fields = '__all__'