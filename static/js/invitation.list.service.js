(function(){
    "use strict";

    angular.module("tictactoe.demo")
        .service("InvitationListService", ["$http", InvitationListService]);

    function InvitationListService($http) {
        this.getActiveInvitations = getActiveInvitations;
        this.getWaitingResponseInvitations = getWaitingResponseInvitations;
        this.acceptInvitation = acceptInvitation;
        this.declineInvitation = declineInvitation;
        this.cancelInvitation = cancelInvitation;
        this.inviteUser = inviteUser;

        function postInvitationActionHttp(invitation){
            var url = "/player/invitation_action/";
            return $http.post(url, invitation)
                .then(function(response){
                    return response
                });
        }

        function postNewInvitationHttp(invitation){
            var url = "/player/new_invitation2/";
            return $http.post(url, invitation)
                .then(function(response){
                    return response
                });
        }

        function getActiveInvitations(){
            var url = "/player/invitations_for_user/";
            return $http.get(url).then(function(response){
                return response.data;
            });
        }

        function getWaitingResponseInvitations(){
            var url = "/player/my_invitations/";
            return $http.get(url).then(function(response){
                return response.data;
            });
        }

        function postInvitationAction(invitationId, action){
            var invitation = {
                id: invitationId,
                action: action
            };
            return postInvitationActionHttp(invitation).then(function(response){
                return response;
            });
        }

        function inviteUser(userId){
            var invitation = {
                from_user: userId,
                to_user: userId
            };
            return postNewInvitationHttp(invitation).then(function(response){
                return response;
            });
        }

        function acceptInvitation(invitationId){
            var action = "ACCEPT";
            return postInvitationAction(invitationId, action).then(function(response){
                return response;
            });
        }

        function declineInvitation(invitationId){
            var action = "DECLINE";
            return postInvitationAction(invitationId, action).then(function(response){
                return response;
            });
        }

        function cancelInvitation(invitationId){
            var action = "CANCEL";
            return postInvitationAction(invitationId, action).then(function(response){
                return response;
            });
        }

    }


}());