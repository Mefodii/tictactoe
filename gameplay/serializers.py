from rest_framework import serializers

from .models import Game, Move


class GameSerializer(serializers.ModelSerializer):
    string = serializers.SerializerMethodField()
    moves_count = serializers.SerializerMethodField()
    absolute_url = serializers.SerializerMethodField()

    def get_absolute_url(self, game):
        return str(game.get_absolute_url())

    def get_moves_count(self, game):
        return int(game.move_set.count())

    def get_string(self, game):
        return str(game)

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
