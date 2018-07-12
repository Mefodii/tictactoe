(function(){
    "use strict";

    angular.module("tictactoe.demo")
        .service("UserService", ["$http", UserService]);

    function UserService($http) {
        this.getAllUsers = getAllUsers;

        function getAllUsers(){
            var url = "/users/";
            return $http.get(url).then(function(response){
                return response.data;
            });
        }

    }


}());