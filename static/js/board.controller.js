(function(){
    "use strict";

    angular.module("tictactoe.demo", [])
        .controller("BoardController", [ "$scope", "$http", "$location", BoardController]);

    function BoardController($scope, $http, $location) {

//      HTTP
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

        function getUserHttp(id){
            return $http.get("/users/" + id + "/").then(function(response){
                return response.data;
            });
        }

        function getCurrentUserHttp(id){
            return $http.get("/current_user/").then(function(response){
                return response.data;
            });
        }

        function makeMoveHttp(move) {
          return $http.post("/games/make_move1/", move).then(
              function success(response) {
                return response.data;
              },
              function error(){
                  throw "Oh, no, the move is not valid";
              }
          )
        }

//      GETTERS

        function getGame() {
          getGameHttp(current_game_id).then(function(data) {
            $scope.game = data;
            refreshStatus();
          });
        }

        function getUserName(userId) {
          return getUserHttp(userId).then(function(data) {
            return data.username;
          });
        }

        function getMoves() {
          getMovesHttp(current_game_id).then(function(data) {
            buildBoardValues(data);
          });
        }

        function getMyId() {
          return getCurrentUserHttp().then(function(data) {
            return data.id;
          });
        }

//      NAN

        function isMyMove(status) {
            if(status.gameStatus.indexOf("F") >= 0){
                if(status.myId == status.firstPlayerId){
                    return true;
                }
                else{
                    return false;
                }
            }
            else if(status.gameStatus.indexOf("S") >= 0){
                if(status.myId == status.secondPlayerId){
                    return true;
                }
                else{
                    return false;
                }
            }
            else{
                return false;
            }
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
                boardInactive();
            });
        }

        function boardInactive(){
            var i,j;
            for(i = 0; i < $scope.board.length; i++){
                for(j = 0; j < $scope.board[i].length; j++){
                    $scope.board[i][j].class = $scope.inactiveCellClass;
                }
            }
        }

        function boardActive(){
            var i,j;
            for(i = 0; i < $scope.board.length; i++){
                for(j = 0; j < $scope.board[i].length; j++){
                    var value = $scope.board[i][j].val
                    if (value != "X" & value != "O"){
                        $scope.board[i][j].class = $scope.activeCellClass;
                    }
                }
            }
        }

        function refreshStatus(){

            $scope.status.gameStatus = String($scope.game.status);
            $scope.status.message = refreshStatusMessage($scope.status.gameStatus,
                                                        $scope.status.firstPlayerName, $scope.status.secondPlayerName);
            $scope.status.iMove = isMyMove($scope.status);
        }

        function refreshStatusMessage(status, firstPlayerName, secondPlayerName){
            var status_message = "";
            var str_status = String(status);
            if (str_status.indexOf("F") >= 0){
                status_message = firstPlayerName + " move";
            }
            else if(str_status.indexOf("S") >= 0){
                status_message = secondPlayerName + " move";
            }
            else if(str_status.indexOf("W") >= 0){
                status_message = firstPlayerName + " wins";
            }
            else if(str_status.indexOf("L") >= 0){
                status_message = secondPlayerName + " wins";
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
                        x: j,
                        y: i,
                        val: "",
                        class: $scope.activeCellClass
                    });
                }
                board.push(row);
            }

            for(i = 0; i < moves.length; i++){
                var move = moves[i];
                var x = move.x;
                var y = move.y;

                board[y][x].val = calculateVal(move.by_first_player);
                board[y][x].class = $scope.inactiveCellClass;
            }

            $scope.board = board;
        }

        function calculateVal(by_first_player){
            var val = "O";
            if(by_first_player){
                val = "X";
            }
            return val;
        }

//      HTML

        $scope.cellClick = function(cell) {
            if($scope.status.iMove){
                makeMove(cell);
            }
        };

//      INIT

        function initializeStatus(){
            var status = {
                gameStatus: "",
                message: "",
                firstPlayerName: "",
                secondPlayerName: "",
                firstPlayerId: -1,
                secondPlayerId: -1,
                myId: -1,
                iMove: false
            };

            status.gameStatus = String($scope.game.status);
            status.firstPlayerId = $scope.game.first_player;
            status.secondPlayerId = $scope.game.second_player;

            getMyId().then(function(result) {
                status.myId = result;
                status.iMove = isMyMove(status);
            });
            getUserName(status.firstPlayerId).then(function(result) {
                status.firstPlayerName = result;
                getUserName(status.secondPlayerId).then(function(result) {
                    status.secondPlayerName = result;
                    status.message = refreshStatusMessage(status.gameStatus,
                                                  status.firstPlayerName, status.secondPlayerName);
                });
            });

            $scope.status = status;
        }

        function initializeGame() {
          getGameHttp(current_game_id).then(function(data) {
            $scope.game = data;
            initializeStatus($scope.game);
          });
        }

        function init(){
            initializeGame();
            getMoves();
        }

        $http.defaults.xsrfHeaderName = "X-CSRFToken";
        $http.defaults.xsrfCookieName = "csrftoken";

        $scope.game = [];
        $scope.board = [];
        $scope.status = {};
        $scope.inactiveCellClass = "tictactoe-cell"
        $scope.activeCellClass = "tictactoe-cell-active"

        var url = $location.absUrl().split('/');
        var current_game_id = url[url.length - 2];

        init();
    }
}());