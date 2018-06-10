from django.shortcuts import get_object_or_404

from .models import Game, Move


def move_prevalidation(request, **kwargs):
    if kwargs['by_first_player']:
        data = request.data
        game_id = data['game']
        game = get_object_or_404(Game, pk=game_id)

        if not game.is_users_move(request.user):
            return None
        else:
            return game.status == "F"
