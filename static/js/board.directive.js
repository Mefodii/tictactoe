(function () {
    'use strict';

    angular.module("tictactoe.demo")
        .directive("gameboard", BoardDirective);

    function BoardDirective() {
        return {
            templateUrl: "/static/html/gameplay/gameboard.html",
            restrict: "E",
            controller: 'BoardController'
        };
    }
})();