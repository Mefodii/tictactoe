(function(){
    "use strict";

    angular.module("tictactoe.demo", [])
        .controller("BoardController", [ "$scope", "$http", "$location", BoardController]);

    function BoardController($scope, $http, $location) {

        $scope.test = function() {
            alert($scope.game.id)
        };


        $scope.test1 = function(element) {
            alert($location.absUrl());
        };


        var url = $location.absUrl().split('/')

        var index = url[url.length - 2]
        $scope.game = [];
        $http.get("/games/games/" + index + "/").then(function(response){
            $scope.game = response.data
        });
    }
}());