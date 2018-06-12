(function(){
    "use strict";

    angular.module("tictactoe.demo", [])
        .controller("BoardController", [ "$scope", "$http", "$location", BoardController]);

    function BoardController($scope, $http, $location) {

        function getMovesHttp(game_id) {
            return $http.get("/games/moves_for_game/" + game_id + "/").then(function(response){
                return response.data;
            });
        }

        function getGameHttp(game_id){
            return $http.get("/games/games/" + game_id + "/").then(function(response){
                return response.data;
            });
        }

        function makeMoveHttp(move) {
          return $http.post("/games/make_move1/", move).then(
              function success(response) {
                return response.data;
              },
              function error(){
                  alert("Could not insert");
              }
          )
        }

        function refreshStatus(status){
            var status_message = "";
            var str_status = String(status);
            if (str_status.indexOf("F") >= 0){
                status_message = "First player move";
            }
            else if(str_status.indexOf("S") >= 0){
                status_message = "Second player move";
            }
            else if(str_status.indexOf("W") >= 0){
                status_message = "First player wins";
            }
            else if(str_status.indexOf("L") >= 0){
                status_message = "Second player wins";
            }
            else if(str_status.indexOf("D") >= 0){
                status_message = "Draw";
            }
            return status_message;
        }

        function buildBoardValues(moves){
            var board = [];
            var val = 0;
            for(var i = 0; i < 3; i++){
                var row = [];
                for(var j = 0; j < 3; j++){
                    row.push({
                        "x": j,
                        "y": i,
                        "val": ""
                    });
                }
                board.push(row);
            }

            for(i = 0; i < moves.length; i++){
                var move = moves[i];
                var x = move.x;
                var y = move.y;

                board[y][x].val = calculateVal(move.by_first_player);
            }

            $scope.board = board;
        }

        $scope.test1 = function(cell) {
            if("FS".indexOf(String($scope.game.status)) >= 0){
                makeMove(cell);
            }
        };

        function calculateVal(by_first_player){
            var val = "O";
            if(by_first_player){
                val = "X";
            }
            return val;
        }

        function makeMove(cell) {
            var move = {
                x: cell.x,
                y: cell.y,
                game: parseInt(current_game_id)
            };

            makeMoveHttp(move).then(function(data) {
                cell.val = calculateVal(data.by_first_player);
                getGame();
            });
        }

        function getGame() {
          getGameHttp(current_game_id).then(function(data) {
            $scope.game = data;
            $scope.status_message = refreshStatus($scope.game.status);
          });
        }

        function getMoves() {
          getMovesHttp(current_game_id).then(function(data) {
            buildBoardValues(data);
          });
        }

        $http.defaults.xsrfHeaderName = "X-CSRFToken";
        $http.defaults.xsrfCookieName = "csrftoken";

        $scope.game = [];
        $scope.board = [];
        $scope.status_message = "test";

        var url = $location.absUrl().split('/');
        var current_game_id = url[url.length - 2];

        getGame();
        getMoves();
    }
}());