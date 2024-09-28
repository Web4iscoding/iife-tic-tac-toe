// Gameboard IIFE
const Gameboard = (function() {
    let board = [ [null, null, null],
                  [null, null, null],
                  [null, null, null] ];
    
    let result;

    const getResult = function() {
        return result;
    }

    const setResult = function(newResult) {
        result = newResult;
    }

    const getBoard = function() {
        return board;
    }

    const setBoard = function(newBoard) {
        board = newBoard;
    }

    const checkResult = function(player1, player2) {
        let check = "";

        for(let i = 0; i < board.length; i++) {
            check = "";
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j] === null)
                    break;
                check += board[i][j];
            }
            if (check === "XXX") {
                result = player1.getName() + " wins! (Click me to restart)";
                return;
            }
            else if (check === "OOO") {
                result = player2.getName() + " wins! (Click me to restart)";
                return;
            }
        }

        for (let i = 0; i < board[0].length; i++) {
            check = "";
            for (let j = 0; j < board.length; j++) {
                if (board[j][i] === null)
                    break;
                check += board[j][i];
            }
            if (check === "XXX") {
                result = player1.getName() + " wins! (Click me to restart)";
                return;
            }
            else if (check === "OOO") {
                result = player2.getName() + " wins! (Click me to restart)";
                return;
            }
        }

        check = "";
        for (let i = 0; i < board.length; i++) {
            if (board[i][i] === null)
                break;
            check += board[i][i];
            if (check === "XXX") {
                result = player1.getName() + " wins! (Click me to restart)";
                return;
            }
            else if (check === "OOO") {
                result = player2.getName() + " wins! (Click me to restart)";
                return;
            }
        }

        check = "";
        for (let i = 0; i < board.length; i++) {
            if (board[i][2 - i] === null)
                break;
            check += board[i][2 - i];
            if (check === "XXX") {
                result = player1.getName() + " wins! (Click me to restart)";
                return;
            }
            else if (check === "OOO") {
                result = player2.getName() + " wins! (Click me to restart)";
                return;
            }
        }

        if (!board.flat().includes(null)) {
            result = "It's a draw! (Click me to restart)";
        }
    }

    return { board, getResult, setResult, checkResult, getBoard, setBoard };
})()

// Player factory function
const Player = function(playerSymbol, playerName) {
    const symbol = playerSymbol;
    let name = playerName;

    const getName = function() {
        return name;
    }

    const setName = function(newName) {
        name = newName;
    }

    return { symbol, getName, setName };
}

// EventHandler IIFE
const EventHandler = (function(gameboard, player1, player2) {

    let control = 0;
    let ended = false;
    const endText = document.querySelector(".gameboard+div");
    const player1InputName = document.querySelector(".player1 > input");
    const player2InputName = document.querySelector(".player2 > input");

    endText.addEventListener("click", (e) => {
        if (ended)
            restartGame();
    })

    const manageClick = function() {
        noOfSquares = gameboard.getBoard().length * gameboard.getBoard().length;
        for (let i = 0; i < noOfSquares; i++) {
            const square = document.querySelector(`.gameboard>div:nth-child(${i + 1})`);
            square.addEventListener("click", (e) => {
                [x, y] = [Math.floor(i / 3), i % 3]
                if (gameboard.getBoard()[x][y] === null && !ended) {
                    if (control % 2 === 0){ 
                        square.textContent = player1.symbol;
                        square.style.color = "red";
                        gameboard.getBoard()[x][y] = player1.symbol;
                    }
                    else {
                        square.textContent = player2.symbol;
                        square.style.color = "green";
                        gameboard.getBoard()[x][y] = player2.symbol;
                    }

                    player1.setName(player1InputName.value === "" ? "Player 1" : player1InputName.value);
                    player2.setName(player2InputName.value === "" ? "Player 2" : player2InputName.value);
                    gameboard.checkResult(player1, player2);
                    if (gameboard.getResult()) {
                        endText.textContent = gameboard.getResult();
                        ended = true;
                    }
                    control++;
                }
            });
        }
    }

    const restartGame = function() {
        gameboard.setBoard([[null, null, null],
                            [null, null, null],
                            [null, null, null]]);
        gameboard.setResult(undefined);
        document.querySelectorAll(`.gameboard > div`).forEach((div) => {
            div.innerHTML = "";
        })
        ended = false;
        control = 0;
        document.querySelector(".gameboard+div").textContent = "";
    }

    return { startGame: manageClick };

})(Gameboard, Player("X", document.querySelector(".player1 > input").value), Player("O", document.querySelector(".player2 > input").value))

EventHandler.startGame();