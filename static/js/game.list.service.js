(function(){
    "use strict";

    angular.module("tictactoe.demo")
        .service("GameListService", ["$http", GameListService]);

    function GameListService($http) {
        this.getActiveGames = getActiveGames;
        this.getFinishedGames = getFinishedGames;

        function getActiveGames(){
            var url = "/player/active_games_for_user/";
            return $http.get(url).then(function(response){
                return response.data;
            });
        }

        function getFinishedGames(){
            var url = "/player/finished_games_for_user/";
            return $http.get(url).then(function(response){
                return response.data;
            });
        }

    }
}());