(function(){
    "use strict";

    angular.module("tictactoe.demo")
        .service("UserService", ["$http", UserService]);

    function UserService($http) {
        this.getAllUsers = getAllUsersHttp;
        this.getCurrentUser = getCurrentUserHttp;
        this.getUser = getUserHttp;

        function getAllUsersHttp(){
            var url = "/users/";
            return $http.get(url).then(function(response){
                return response.data;
            });
        }

        function getCurrentUserHttp(){
            var url = "/current_user/";
            return $http.get(url).then(function(response){
                return response.data;
            });
        }

        function getUserHttp(id){
            var url = "/users/" + id + "/";
            return $http.get(url).then(function(response){
                return response.data;
            });
        }

    }


}());