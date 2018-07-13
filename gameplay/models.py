from django.db import models
from django.db.models import Q
from django.contrib.auth.models import User
from django.urls import reverse
from django.core.validators import MaxValueValidator, MinValueValidator
from django.shortcuts import get_object_or_404

# Create your models here.

GAME_STATUS_CHOICES = (
    ("F", "First player to move"),
    ("S", "Second player to move"),
    ("W", "First player wins"),
    ("L", "Second player wins"),
    ("D", "Draw")
)

BOARD_SIZE = 3


class GameQuerySet(models.QuerySet):
    def games_for_user(self, user):

        return self.filter(
            Q(first_player=user) | Q(second_player=user)
        )

    def active(self):

        return self.filter(
            Q(status="F") | Q(status="S")
        )


class Game(models.Model):
    first_player = models.ForeignKey(User, related_name="games_first_player", on_delete=models.CASCADE)
    second_player = models.ForeignKey(User, related_name="games_second_player", on_delete=models.CASCADE)
    start_time = models.DateTimeField(auto_now_add=True)
    last_active = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=1, default='F', choices=GAME_STATUS_CHOICES)

    objects = GameQuerySet.as_manager()

    def board(self):
        board = [[None for x in range(BOARD_SIZE)] for y in range(BOARD_SIZE)]
        for move in self.move_set.all():
            board[move.y][move.x] = move
        return board

    def new_move(self):
        if self.status not in "FS":
            raise ValueError("Cannot make move on finished game")
        return Move(
            game=self,
            by_first_player=self.status == "F"
        )

    def now_move(self, user):
        if self.is_users_move(user):
            return user
        else:
            if user == self.first_player:
                return self.second_player
            else:
                return self.first_player

    def is_users_move(self, user):
        return (user == self.first_player and self.status == "F") or\
                (user == self.second_player and self.status == "S")

    def get_absolute_url(self):
        return reverse("gameplay_detail", args=[self.id])

    def update_after_move(self, move):
        self.status = self._get_game_status_after_move(move)

    def _get_game_status_after_move(self, move):
        if self.is_endgame(move):
            return "W" if move.by_first_player else "L"
        if self.move_set.count() >= BOARD_SIZE**2:
            return "D"
        return "S" if self.status == "F" else "F"

    def is_endgame(self, move):
        x, y = move.x, move.y
        board = self.board()
        if board[y][0] == board[y][1] == board[y][2]:
            return True
        elif board[0][x] == board[1][x] == board[2][x]:
            return True
        elif board[1][1] \
                and ((board[0][0] == board[1][1] == board[2][2])
                     or (board[0][2] == board[1][1] == board[2][0])):
            return True
        else:
            return False

    def status_string(self):
        if self.status == "F":
            return self.first_player.username + " moves";
        if self.status == "S":
            return self.second_player.username + " moves";
        if self.status == "W":
            return self.first_player.username + " WINS";
        if self.status == "L":
            return self.second_player.username + " WINS";
        if self.status == "D":
            return "DRAW";

    def __str__(self):
        return "{0} vs {1}".format(self.first_player, self.second_player)


class MoveQuerySet(models.QuerySet):
    def move_for_coords(self, game, x, y):

        return self.filter(
            Q(x=x) & Q(y=y) & Q(game=game)
        )


class Move(models.Model):
    x = models.IntegerField(
        validators=[MinValueValidator(0),
                    MaxValueValidator(BOARD_SIZE-1)]
    )
    y = models.IntegerField(
        validators=[MinValueValidator(0),
                    MaxValueValidator(BOARD_SIZE-1)]
    )
    comment = models.CharField(max_length=300, blank=True)
    by_first_player = models.BooleanField()

    def __eq__(self, other):
        if other is None:
            return False
        return other.by_first_player == self.by_first_player

    def save(self, *args, **kwargs):
        super(Move, self).save(*args, **kwargs)
        self.game.update_after_move(self)
        self.game.save()

    @staticmethod
    def move_exists(game_id, x, y):
        # game = get_object_or_404(Game, pk=game_id)
        # if game:
        # move = Move.objects.move_for_coords(game_id, x, y)
        # if move:
        #     return True
        # else:
        return False
        # return False


    game = models.ForeignKey(Game, on_delete=models.CASCADE)
