(function(){
    "use strict";

    angular.module("tictactoe.demo")
        .controller("HomeController", [ "$scope", "GameListService", "InvitationListService", "UserService", HomeController]);

    function HomeController($scope, GameListService, InvitationListService, UserService) {

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

        /*    ------------------------=======================----------------------    */

        function removeActiveInvitation(invitation){
            removeElement($scope.activeInvitations, invitation);
        }

        function removeWaitingResponseInvitation(invitation){
            removeElement($scope.waitingResponseInvitations, invitation);
        }

        function addActiveGame(game){
            addElement($scope.activeGames, game);
        }

        function addWaitingResponse(invitation){
            addElement($scope.waitingResponseInvitations, invitation);
        }

        function obtainGameCssClass(game){
            var gameStatus = game.status;
            var firstPlayerId = game.first_player;
            var secondPlayerId = game.second_player;
            var cssClass = "";
            if(gameStatus === "F" || gameStatus === "S"){
                if ((gameStatus === "F" && firstPlayerId === $scope.currentUser.id) ||
                    (gameStatus === "S" && secondPlayerId === $scope.currentUser.id)){
                    cssClass = "user-move";
                }
                else{
                    cssClass = "opponent-move";
                }
            }
            else if(gameStatus === "W" || gameStatus === "L"){
                if ((gameStatus === "W" && firstPlayerId === $scope.currentUser.id) ||
                    (gameStatus === "L" && secondPlayerId === $scope.currentUser.id)){
                    cssClass = "game-win";
                }
                else{
                    cssClass = "game-lose";
                }
            }
            else if(gameStatus === "D"){
                cssClass = "game-draw";
            }
            return cssClass;
        }

        /*    ------------------------=======================----------------------    */

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
            InvitationListService.inviteUser($scope.userToInvite.id).then(function(response) {
               addWaitingResponse(response.data);
            });
        };

        $scope.setCssClass = function(gameObj){
            gameObj.class = obtainGameCssClass(gameObj);
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
            InvitationListService.getWaitingResponseInvitations().then(function (data) {
                $scope.waitingResponseInvitations = data;
            });
            UserService.getAllUsers().then(function (data) {
                $scope.userList = data;
            });
            UserService.getCurrentUser().then(function (data) {
                $scope.currentUser = data;
            });
        }

        $scope.activeGames = [];
        $scope.finishedGames = [];

        $scope.activeInvitations = [];
        $scope.waitingResponseInvitations = [];

        $scope.userList = [];
        $scope.currentUser = JSON.parse(localStorage.currentUser);

        init();

    }
}());