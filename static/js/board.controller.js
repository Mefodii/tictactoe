(function(){
    "use strict";

    angular.module("tictactoe.demo", [])
        .controller("BoardController", [ "$scope", "$http", "$location", BoardController]);

    function BoardController($scope, $http, $location) {

        $scope.test = function() {
            alert($scope.game.id)
        };

        $scope.initCells = function() {
        };

        function getMoves(game_id) {
            $http.get("/games/moves_for_game/" + game_id + "/").then(function(response){
                $scope.moves = response.data;
            });
        }


        $scope.test1 = function(x, y) {
//            alert(x + ", " + y);
            alert($scope.moves);
        };

        $scope.increment = function() {
            $scope.x++;
        }


        var url = $location.absUrl().split('/')
        $scope.x = 0;
        var index = url[url.length - 2]
        $scope.game = [];
        $scope.moves = [];
        $http.get("/games/games/" + index + "/").then(function(response){
            $scope.game = response.data
            getMoves($scope.game.id);
        });
    }
}());