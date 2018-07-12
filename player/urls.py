from django.contrib import admin
from django.urls import path
from django.conf.urls import url
from django.contrib.auth.views import LoginView, LogoutView

from .views import home, new_invitation, accept_invitation, SignUpView
from .api import active_games_for_user, finished_games_for_user, invitations_for_user, my_invitations, \
    invitation_action, new_invitation2

urlpatterns = [
    path('home', home, name="player_home"),
    path("login", LoginView.as_view(template_name="player/login_form.html"),
         name="player_login"),
    path("logout", LogoutView.as_view(),
         name="player_logout"),
    path("new_invitation", new_invitation,
         name="player_new_invitation"),
    path("new_invitation2/", new_invitation2),
    path("accept_invitation/<int:id>/",
         accept_invitation,
         name="player_accept_invitation"),
    path("signup", SignUpView.as_view(), name="player_signup"),
    path("active_games_for_user/", active_games_for_user),
    path("finished_games_for_user/", finished_games_for_user),
    path("invitations_for_user/", invitations_for_user),
    path("my_invitations/", my_invitations),
    path("invitation_action/", invitation_action),

]
