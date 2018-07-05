from rest_framework import serializers

from .models import Invitation


class InvitationSerializer(serializers.ModelSerializer):
    from_user_username = serializers.SerializerMethodField()
    to_user_username = serializers.SerializerMethodField()

    def get_from_user_username(self, invitation):
        return str(invitation.from_user.username)

    def get_to_user_username(self, invitation):
        return str(invitation.to_user.username)

    class Meta:
        model = Invitation
        fields = '__all__'
