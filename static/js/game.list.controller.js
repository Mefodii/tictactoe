(function(){
    "use strict";

    angular.module("tictactoe.demo")
        .controller("GameListController", [ "$scope", "$http", "$location", "$interval", "$q", GameListController]);

    function GameListController($scope, $http, $location, $interval, $q) {

        function getActiveGamesHttp(){
            return $http.get("/player/active_games_for_user/").then(function(response){
                return response.data;
            });
        }

        function getFinishedGamesHttp(){
            return $http.get("/player/finished_games_for_user/").then(function(response){
                return response.data;
            });
        }

        function getActiveGames(){
            getActiveGamesHttp().then(function(data) {
                $scope.activeGames = data;
            });
        }

        function getFinishedGames(){
            getFinishedGamesHttp().then(function(data) {
                $scope.finishedGames = data;
            });
        }

        function init(){
            getActiveGames();
            getFinishedGames();
        }

        $scope.activeGames = [];
        $scope.finishedGames = [];

        init()

    }
}());