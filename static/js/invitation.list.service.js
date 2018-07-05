(function(){
    "use strict";

    angular.module("tictactoe.demo")
        .service("InvitationListService", ["$http", InvitationListService]);

    function InvitationListService($http) {
        this.getActiveInvitations = getActiveInvitations;
        this.acceptInvitation = acceptInvitation;
        this.declineInvitation = declineInvitation;

        function postInvitationActionHttp(invitation){
            var url = "/player/invitation_action/";
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

        function acceptInvitation(invitationId){
            var invitation = {
                id: invitationId,
                accept: true
            };
            return postInvitationActionHttp(invitation).then(function(response){
                return response;
            });
        }

        function declineInvitation(invitationId){
            var invitation = {
                id: invitationId,
                accept: false
            };
            return postInvitationActionHttp(invitation).then(function(response){
                return response;
            });
        }

    }


}());