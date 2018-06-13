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

    def validate(self, attrs):
        game = attrs['game']
        x, y = attrs['x'], attrs['y']
        if game.board()[y][x] is not None:
            raise serializers.ValidationError("Cell not empty")
        return attrs
