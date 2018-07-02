(function(){
    "use strict";

    angular.module("tictactoe.demo")
        .controller("BoardController", [ "$scope", "$http", "$location", "$interval", "$q", BoardController]);

    function BoardController($scope, $http, $location, $interval, $q) {
//      INTERVALS

        var gameStatusCheckPromise = null;

        function startPollingGameStatusUpdate(){
            stopPollingGameStatusUpdate();
            gameStatusCheckPromise=$interval(checkGameStatusUpdate, 1000);
        }

        function stopPollingGameStatusUpdate(){
            $interval.cancel(gameStatusCheckPromise);
            gameStatusCheckPromise = null;
        }

        function checkGameStatusUpdate() {
            getIsMyMoveStatusHttp(current_game_id).then(function(data) {
                if(data){
                    stopPollingGameStatusUpdate();
                    opponentMoved();
                }
            });
        }



//      HTTP
        function getIsMyMoveStatusHttp(gameId) {
            return $http.get("/games/is_my_move/", {params: {game: gameId}}).then(function(response){
                return response.data;
            });
        }

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

        function getGameStatusHttp(id){
            return $http.get("/games/status/" + id + "/").then(function(response){
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

        function refreshGame() {
          return getGameHttp(current_game_id).then(function(data) {
            $scope.game = data;
          });
        }

        function refreshMoves() {
          return getMovesHttp(current_game_id).then(function(data) {
            $scope.moves = data;
          });
        }

        function getUserName(userId) {
          return getUserHttp(userId).then(function(data) {
            return data.username;
          });
        }

        function getMyId() {
          return getCurrentUserHttp().then(function(data) {
            return data.id;
          });
        }

//      NAN

        function isMyMove(status) {
            if(status.gameStatus.indexOf("F") >= 0 && status.myId == status.firstPlayerId){
                return true;
            }
            else if(status.gameStatus.indexOf("S") >= 0 && status.myId == status.secondPlayerId){
                return true;
            }
            else{
                return false;
            }
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
                    if (value != "X" && value != "O"){
                        $scope.board[i][j].class = $scope.activeCellClass;
                    }
                }
            }
        }

        function opponentMoved(){
            $q.all([refreshGame(), refreshMoves()]).then(function(result) {
                $scope.board = initializeBoard($scope.moves);
                refreshStatus();
            });
        }

        function refreshStatus(){

            $scope.status.gameStatus = String($scope.game.status);
            $scope.status.message = refreshStatusMessage($scope.status.gameStatus,
                                                        $scope.status.firstPlayerName, $scope.status.secondPlayerName);
            $scope.status.iMove = isMyMove($scope.status);
            if($scope.status.iMove){
                boardActive();
            }
            else{
                boardInactive();
            }
        }

        function refreshStatusMessage(status, firstPlayerName, secondPlayerName){
            var status_message = "";
            var str_status = String(status);
            if (str_status.indexOf("F") >= 0){
                status_message = firstPlayerName + " move (X)";
            }
            else if(str_status.indexOf("S") >= 0){
                status_message = secondPlayerName + " move (O)";
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

        function initializeBoard(moves){
            var board = [];
            var val = 0;
            for(var i = 0; i < 3; i++){
                var row = [];
                for(var j = 0; j < 3; j++){
                    row.push({
                        x: j,
                        y: i,
                        val: "",
                        tempVal: "",
                        class: $scope.inactiveCellClass
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

            return board;
        }

        function calculateVal(by_first_player){
            return by_first_player ? "X" : "O";
        }

        function isEmptyCell(cell){
            var value = cell.val;
            if (value != "X" && value != "O"){
                return true;
            }
            return false;
        }

//      HTML

        $scope.mouseOverCell = function(cell){
            if($scope.status.iMove & isEmptyCell(cell)){
                cell.tempVal = $scope.status.myChar;
            }
        }

        $scope.mouseLeaveCell = function(cell){
            if($scope.status.iMove & isEmptyCell(cell)){
                cell.tempVal = "";
            }
        }

        $scope.cellClick = function(cell) {
            if($scope.status.iMove & isEmptyCell(cell)){
                cell.tempVal = "";
                makeMove(cell);
            }
        };

        function makeMove(cell) {
            var move = {
                x: cell.x,
                y: cell.y,
                game: parseInt(current_game_id)
            };

            makeMoveHttp(move).then(function(data) {
                cell.val = calculateVal(data.by_first_player);
                refreshGame().then(function () {
                    $scope.board[move.y][move.x].class = $scope.inactiveCellClass;
                    refreshStatus();
                    if($scope.status.gameStatus == "F" || $scope.status.gameStatus == "S"){
                        startPollingGameStatusUpdate();
                    }
                });
            });
        }

//      INIT
        function createDefaultStatus(){
            var status = {
                    gameStatus: "",
                    message: "",
                    firstPlayerName: "",
                    secondPlayerName: "",
                    firstPlayerId: -1,
                    secondPlayerId: -1,
                    myId: -1,
                    myChar: "",
                    iMove: false
                };

            return status;
        }

        function initializeStatus(game){
            return $q.all([getMyId(), getUserName(game.first_player),
                            getUserName(game.second_player)]).then(function(result) {
                var status = createDefaultStatus();

                status.gameStatus = String(game.status);
                status.firstPlayerId = game.first_player;
                status.secondPlayerId = game.second_player;
                status.myId = result[0];
                status.iMove = isMyMove(status);
                status.firstPlayerName = result[1];
                status.secondPlayerName = result[2];
                status.message = refreshStatusMessage(status.gameStatus,
                                                        status.firstPlayerName, status.secondPlayerName);
                if(status.myId == status.firstPlayerId){
                    status.myChar = "X";
                }
                else{
                    status.myChar = "O";
                }

                return status;
            });
        }

        function init(){
            $q.all([refreshGame(), refreshMoves()]).then(function(result) {
                $scope.board = initializeBoard($scope.moves);
                initializeStatus($scope.game).then(function(result) {
                    $scope.status = result;
                    if($scope.status.iMove){
                        boardActive();
                    }
                    else{
                        boardInactive();
                        if($scope.status.gameStatus == "F" || $scope.status.gameStatus == "S"){
                            startPollingGameStatusUpdate();
                        }
                    }
                });
            });
        }

        $scope.game = [];
        $scope.moves = [];
        $scope.board = [];
        $scope.status = [];
        $scope.inactiveCellClass = "tictactoe-cell";
        $scope.activeCellClass = "tictactoe-cell-active";

        var url = $location.absUrl().split('/');
        var current_game_id = url[url.length - 2];

        init();
    }
}());