(function(){
    "use strict";

    angular.module("tictactoe.demo")
        .controller("HomeController", [ "$scope", "$http", "GameListService", "InvitationListService", "UserService", HomeController]);

    function HomeController($scope, $http, GameListService, InvitationListService, UserService) {

        /*                  LIST MANIPULATION                     */

        function removeElement(list, element){
            list.splice(
                list.indexOf(element),
                1
            );
        }

        function addElement(list, element){
            list.push(element)
        }

        /*    ------------------===============---------------    */

        function removeActiveInvitation(invitation){
            removeElement($scope.activeInvitations, invitation);
        }

        function removeWaitingResponseInvitation(invitation){
            removeElement($scope.waitingResponseInvitations, invitation);
        }

        function addActiveGame(game){
            addElement($scope.activeGames, game);
        }

        $scope.acceptInvitation = function(invitation) {
            InvitationListService.acceptInvitation(invitation.id).then(function(response) {
                removeActiveInvitation(invitation);
                addActiveGame(response.data);
            });
        };

        $scope.declineInvitation = function(invitation) {
            InvitationListService.declineInvitation(invitation.id).then(function(response) {
                removeActiveInvitation(invitation);
            });
        };

        $scope.cancelInvitation = function(invitation) {
            InvitationListService.cancelInvitation(invitation.id).then(function(response) {
                removeWaitingResponseInvitation(invitation);
            });
        };

        $scope.inviteUser = function() {
            InvitationListService.inviteUser($scope.userToInvite).then(function(response) {
//                addWaitingResponse(response.data);
            });
        };

        function init(){
            GameListService.getActiveGames().then(function (data) {
                $scope.activeGames = data;
            });
            GameListService.getFinishedGames().then(function (data) {
                $scope.finishedGames = data;
            });
            InvitationListService.getActiveInvitations().then(function (data) {
                $scope.activeInvitations = data;
            })
            InvitationListService.getWaitingResponseInvitations().then(function (data) {
                $scope.waitingResponseInvitations = data;
            });
            UserService.getAllUsers().then(function (data) {
                $scope.userList = data;
            });
        }

        $scope.activeGames = [];
        $scope.finishedGames = [];

        $scope.activeInvitations = [];
        $scope.waitingResponseInvitations = [];

        $scope.userList = [];

        init();

    }
}());