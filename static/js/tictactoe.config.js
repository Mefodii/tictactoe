(function () {
    'use strict';

    angular.module("tictactoe.demo")
        .config(["$routeProvider", config])

    function config($routeProvider) {

        $routeProvider
            .when("/player/home", {
                templateUrl: "/static/html/scrumboard.html",
                controller: "GameListController",
            })
            .when("/login", {
                templateUrl: "/static/html/login.html",
                controller: "BoardController",
            });

    }
})();