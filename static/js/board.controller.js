(function(){
    "use strict";

    angular.module("tictactoe.demo", [])
        .controller("BoardController", [ "$scope", "$http", "$location", BoardController]);

    function BoardController($scope, $http, $location) {

        $scope.test = function() {
            alert($scope.game.id)
        };


        $scope.test1 = function(x, y) {
            alert(x + ", " + y);
        };

        $scope.increment = function() {
            $scope.x++;
        }


        var url = $location.absUrl().split('/')
        $scope.x = 0;

        var index = url[url.length - 2]
        $scope.game = [];
        $http.get("/games/games/" + index + "/").then(function(response){
            $scope.game = response.data
        });
    }
}());