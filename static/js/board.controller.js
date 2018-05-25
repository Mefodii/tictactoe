(function(){
    "use strict";

    angular.module("tictactoe.demo", [])
        .controller("BoardController", [ "$scope", "$http", BoardController]);

    function BoardController($scope, $http) {

        $scope.test = function() {
            alert("Hello world");
        };
    }
}());