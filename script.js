//GameBoard module
const gameBoard = (function GameBoard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let r = 0; r < rows; r++) {
        board[r] = [];
        for (let c = 0; c < columns; c++) {
            board[r].push(Cell());
        }
    }

    const getBoard = () => board;
    const printBoard = () => {
        const boardWithCellValues = board.map(row => row.map(cell => cell.getValue()));
        console.table(boardWithCellValues);
    };

    return {getBoard, printBoard};
})();

//Cell factory function
function Cell() {
    let value = "";
    const getValue = () => value;
    const markCell = (player) => value = player; 

    return {getValue, markCell};
}

//Players module
const players = (function Players() {
    const players = [
        { name: "Yanfei", token: "X" },
        { name: "Xingqiu", token: "O" }
    ];
    let currentPlayer = players[0];
    const getCurrentPlayer = () => currentPlayer;
    const switchPlayer = () => currentPlayer = currentPlayer === players[0] ? players[1] : players[0];

    return {getCurrentPlayer, switchPlayer};
})();

//GameController factory function
function GameController() {
    const board = gameBoard.getBoard();

    let win = false;
    let tie = false;

    const checkGameWon = () => win;
    const checkGameTie = () => tie;

    const playRound = (e) => {
        if (board[e.target.dataset.row][e.target.dataset.column].getValue() !== "") {
            console.log("That cell already has a token, please choose another cell...");
            return;
        }
        board[e.target.dataset.row][e.target.dataset.column].markCell(players.getCurrentPlayer().token);
        players.switchPlayer();
        console.log(`${players.getCurrentPlayer().name}'s turn`);
        
        checkWinner();
        checkTie();
        gameBoard.printBoard();
        screenController.updateScreen();
        if (win) {
            gameBoard.printBoard();
            console.log(`${players.getCurrentPlayer().name} has won`);
            return;
        } else if (tie) {
            gameBoard.printBoard();
            console.log("The game is tie, every cell has been filled");
            return;
        };
    };
    
    const [[cell1, cell2, cell3], [cell4, cell5, cell6], [cell7, cell8, cell9]] = board;
    const cells = [cell1, cell2, cell3, cell4, cell5, cell6, cell7, cell8, cell9];

    function checkWinner() {
        const winCombinations = [
            [cell1, cell2, cell3],
            [cell4, cell5, cell6],
            [cell7, cell8, cell9],
            [cell1, cell4, cell7], 
            [cell2, cell5, cell8],
            [cell3, cell6, cell9],
            [cell1, cell5, cell9], 
            [cell3, cell5, cell7]
        ];

        winCombinations.forEach(winCombination => {
           if (winCombination[0].getValue() === "" || winCombination[1].getValue() === "" || winCombination[2].getValue() === "") return;
           else if (winCombination[0].getValue() === winCombination[1].getValue() && winCombination[1].getValue() === winCombination[2].getValue()) win = true;
        });
    };

    function checkTie() {
        if (cells.every(cell => cell.getValue() !== "")) tie = true;
    }

    gameBoard.printBoard();
    console.log(`${players.getCurrentPlayer().name}'s turn`);

    return {playRound, checkGameWon, checkGameTie};
};

//ScreenController module
const screenController = (function() {
    //DOM queries
    const boardDiv = document.querySelector(".board");
    const turnDiv = document.querySelector(".turn");
    const btnRestart = document.querySelector(".btn-restart");
    const player1ScoreDiv = document.querySelector(".score-player-1");
    const player2ScoreDiv = document.querySelector(".score-player-2");

    let player1Score = 0;
    let player2Score = 0;

    const board = gameBoard.getBoard();

    //gameController module
    const game = GameController();

    //Update screen
    function updateScreen() {
        boardDiv.textContent = "";
        turnDiv.textContent = players.getCurrentPlayer().name + "'s turn"
        

        board.forEach((row, rowIndex) => {
            row.forEach((cell, columnIndex) => {
                const cellBtn = document.createElement("button");
                cellBtn.classList.add("cell");
                cellBtn.dataset.row = rowIndex;
                cellBtn.dataset.column = columnIndex;
                cellBtn.textContent = cell.getValue();
                boardDiv.append(cellBtn);
            })
        })
        if (game.checkGameWon()) {
            players.switchPlayer();
            turnDiv.textContent = players.getCurrentPlayer().name + " has won";
            boardDiv.removeEventListener("click", game.playRound);
            if (players.getCurrentPlayer().name === "Yanfei") {
                player1Score++;
                player1ScoreDiv.textContent = player1Score;
            } else {
                player2Score++;
                player2ScoreDiv.textContent = player2Score;
            }
        }
        if (game.checkGameTie()) {
            turnDiv.textContent = "The game is tie";
        }
    };

    updateScreen();

    const eventHandlerBoard = () => {
        boardDiv.addEventListener("click", game.playRound)
    }

    eventHandlerBoard();

    // btnRestart.addEventListener("click", updateScreen);

    return {updateScreen};  
})();