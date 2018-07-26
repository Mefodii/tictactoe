(function(){
    "use strict";

    angular.module("tictactoe.demo")
        .service("GameListService", ["$http", GameListService]);

    function GameListService($http) {
        this.getActiveGames = getActiveGames;
        this.getFinishedGames = getFinishedGames;
        this.forfeitGame = forfeitGame;

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

        function forfeitGame(game){
            var url = "/games/forfeit_game/";
            return $http.post(url, game.id)
                .then(function(response){
                    return response
            });
        }

    }
}());