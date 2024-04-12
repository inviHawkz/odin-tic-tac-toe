//gameBoard module
const GameBoard = (function() {
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

    return {getBoard};
})();

//Cell module
function Cell() {
    let value = "";
    const getValue = () => value;
    const setValue = (player) => value = player;
    return {getValue, setValue};
}

//players module
const Players = (function() {
    const players = [
        { name: "Yanfei", token: "X" },
        { name: "Xingqiu", token: "O" }
    ];

    const getP1Name = () => players[0].name;
    const getP1Token = () => players[0].token;
    const getP2Name = () => players[1].name;
    const getP2Token = () => players[1].token;

    return {getP1Name, getP2Name, getP1Token, getP2Token};
})();

//gameController module
const GameController = (function() {
    const board = GameBoard.getBoard();
    let currentPlayer = Players.getP1Token();
    
    const playRound = (e) => {
        if (e.target.textContent === "") {
            e.target.textContent = currentPlayer;
            checkWinner();
            switchTurn();
        }
    };

    function checkWinner() {
        //using array destructuring to assign variable names to each cell
        const [[cell1, cell2, cell3], [cell4, cell5, cell6], [cell7, cell8, cell9]] = board;
        const winCombinations = [
            [cell1, cell2, cell3], //row win combinations
            [cell4, cell5, cell6],
            [cell7, cell8, cell9],
            [cell1, cell4, cell7], //column win combinations
            [cell2, cell5, cell8],
            [cell3, cell6, cell9],
            [cell1, cell5, cell9], //diagonal win combinations
            [cell3, cell5, cell7]
        ];
        for (let i = 0; i < winCombinations.length; i++) {
            const winCombination = winCombinations[i];
            const cellA = winCombination[0].getValue();
            const cellB = winCombination[1].getValue();
            const cellC = winCombination[2].getValue();

            if (cellA !== "" && cellB !== "" && cellC !== "") {
                if (cellA === cellB & cellB === cellC) {
                    console.log(`${cellA} wins!`);
                };
            };
        };

    }

    function switchTurn() {
        currentPlayer = currentPlayer === Players.getP1Token() ? Players.getP2Token() : Players.getP1Token();
    }

    return {playRound};
})();

//Screen controller
const ScreenController = (function() {
    const boardDiv = document.querySelector(".board");
    const board = GameBoard.getBoard();
    board.forEach(row => {
        row.forEach(column => {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.textContent = column.getValue();
            cell.addEventListener("click", GameController.playRound);
            boardDiv.append(cell);
        })
    })

    // const cells = document.querySelectorAll(".cell");
    // cells.forEach(cell => cell.addEventListener("click", GameController.playRound()));

    return {}
})();