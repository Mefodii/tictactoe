(function(){
    "use strict";

    angular.module("tictactoe.demo", [])
        .run(["$http", "UserService", run]);


    function run($http, UserService) {
        $http.defaults.xsrfHeaderName = "X-CSRFToken";
        $http.defaults.xsrfCookieName = "csrftoken";

        UserService.getCurrentUser().then(function (data) {
            localStorage.currentUser = JSON.stringify(data);
        });
    }
}());