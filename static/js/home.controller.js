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

        function obtainGameCssClass(gameStatus){
            var cssClass = "";
            if (gameStatus.indexOf("F") >= 0){
                cssClass = "user-move";
            }
            else if(gameStatus.indexOf("S") >= 0){
                cssClass = "opponent-move";
            }
            else if(gameStatus.indexOf("W") >= 0){
                cssClass = "game-win";
            }
            else if(gameStatus.indexOf("L") >= 0){
                cssClass = "game-lose";
            }
            else if(gameStatus.indexOf("D") >= 0){
                cssClass = "game-draw";
            }
            return cssClass;
        }

        function setActiveGamesClasses(){
            for(var i = 0; i < $scope.activeGames.length; i++){
                $scope.activeGames[i].class = obtainGameCssClass($scope.activeGames[i].status)
            }
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
            gameObj.class = obtainGameCssClass(gameObj.status);
        }

        function init(){
            GameListService.getActiveGames().then(function (data) {
                $scope.activeGames = data;
                setActiveGamesClasses();
            });
            GameListService.getFinishedGames().then(function (data) {
                $scope.finishedGames = data;
//                setFinishedGamesClasses();
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