(function(){
    "use strict";

    angular.module("tictactoe.demo")
        .controller("HomeController", [ "$scope", "$http", "GameListService", "InvitationListService", HomeController]);

    function HomeController($scope, $http, GameListService, InvitationListService) {

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

        function init(){
            GameListService.getActiveGames().then(function (data) {
                $scope.activeGames = data;
            });
            GameListService.getFinishedGames().then(function (data) {
                $scope.finishedGames = data;
            });
            InvitationListService.getActiveInvitations().then(function (data) {
                $scope.activeInvitations = data;
            });
        }

        $scope.activeGames = [];
        $scope.finishedGames = [];
        $scope.activeInvitations = [];

        init();

    }
}());