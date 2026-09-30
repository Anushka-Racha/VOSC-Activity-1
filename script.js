/* =========================================
   GET HTML ELEMENTS
========================================= */

const setup = document.getElementById("setup");
const game = document.getElementById("game");

const player1NameInput =
    document.getElementById("player1Name");

const player2NameInput =
    document.getElementById("player2Name");

const symbolButtons =
    document.querySelectorAll(".symbol-btn");

const startGameBtn =
    document.getElementById("startGameBtn");

const errorMessage =
    document.getElementById("errorMessage");

const cells =
    document.querySelectorAll(".cell");

const statusText =
    document.getElementById("status");

const player1Display =
    document.getElementById("player1Display");

const player2Display =
    document.getElementById("player2Display");

const player1SymbolElement =
    document.getElementById("player1Symbol");

const player2SymbolElement =
    document.getElementById("player2Symbol");

const score1Element =
    document.getElementById("score1");

const score2Element =
    document.getElementById("score2");

const player1Card =
    document.getElementById("player1Card");

const player2Card =
    document.getElementById("player2Card");

const result =
    document.getElementById("result");

const strike =
    document.getElementById("strike");

const nextRoundBtn =
    document.getElementById("nextRoundBtn");

const resetGameBtn =
    document.getElementById("resetGameBtn");


/* =========================================
   GAME VARIABLES
========================================= */

let player1Name = "";
let player2Name = "";

/*
   Player 1 chooses X or O.
   Player 2 automatically gets the other symbol.
*/
let p1Symbol = "X";
let p2Symbol = "O";

let currentPlayer = 1;

let board = [
    "", "", "",
    "", "", "",
    "", "", ""
];

let gameActive = false;

let score1 = 0;
let score2 = 0;


/* =========================================
   WINNING COMBINATIONS
========================================= */

const winningPatterns = [

    // Rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    // Columns
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    // Diagonals
    [0, 4, 8],
    [2, 4, 6]

];


/* =========================================
   SYMBOL SELECTION
========================================= */

symbolButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        /*
           Remove selected class from
           both buttons.
        */
        symbolButtons.forEach(function(btn) {
            btn.classList.remove("selected");
        });


        /*
           Select the clicked button.
        */
        button.classList.add("selected");


        /*
           Get X or O from data-symbol.
        */
        p1Symbol = button.dataset.symbol;


        /*
           Give the other symbol to Player 2.
        */
        if (p1Symbol === "X") {
            p2Symbol = "O";
        } else {
            p2Symbol = "X";
        }

    });

});


/* =========================================
   START GAME
========================================= */

startGameBtn.addEventListener("click", startGame);


function startGame() {

    /*
       Get names from input boxes.
    */
    player1Name =
        player1NameInput.value.trim();

    player2Name =
        player2NameInput.value.trim();


    /*
       Check whether both names
       are entered.
    */
    if (
        player1Name === "" ||
        player2Name === ""
    ) {

        errorMessage.textContent =
            "Please enter both player names.";

        return;
    }


    /*
       Check whether both names
       are the same.
    */
    if (
        player1Name.toLowerCase() ===
        player2Name.toLowerCase()
    ) {

        errorMessage.textContent =
            "Please enter different names.";

        return;
    }


    /*
       Remove error message.
    */
    errorMessage.textContent = "";


    /*
       Display player names.
    */
    player1Display.textContent =
        player1Name;

    player2Display.textContent =
        player2Name;


    /*
       Display symbols.
    */
    player1SymbolElement.textContent =
        p1Symbol;

    player2SymbolElement.textContent =
        p2Symbol;


    /*
       Hide setup screen.
    */
    setup.style.display = "none";


    /*
       Show game screen.
    */
    game.style.display = "block";


    /*
       Start first round.
    */
    startRound();

}


/* =========================================
   START NEW ROUND
========================================= */

function startRound() {

    /*
       Empty the board.
    */
    board = [
        "", "", "",
        "", "", "",
        "", "", ""
    ];


    /*
       Game is active.
    */
    gameActive = true;


    /*
       Player 1 always starts.
    */
    currentPlayer = 1;


    /*
       Clear result.
    */
    result.textContent = "";


    /*
       Remove strike line.
    */
    strike.classList.remove("show");

    strike.style.display = "none";


    /*
       Clear every cell.
    */
    cells.forEach(function(cell) {

        cell.textContent = "";

        cell.disabled = false;

        cell.classList.remove(
            "x",
            "o"
        );

    });


    /*
       Show Player 1's turn.
    */
    updateTurn();

}


/* =========================================
   CELL CLICK
========================================= */

cells.forEach(function(cell) {

    cell.addEventListener(
        "click",
        handleCellClick
    );

});


function handleCellClick(event) {

    /*
       Don't allow clicks after
       game has ended.
    */
    if (!gameActive) {
        return;
    }


    /*
       Find which cell was clicked.
    */
    const cell = event.target;

    const index =
        Number(cell.dataset.index);


    /*
       Don't allow already-filled cells.
    */
    if (board[index] !== "") {
        return;
    }


    /*
       Decide which symbol belongs
       to the current player.
    */
    let symbol;


    if (currentPlayer === 1) {

        symbol = p1Symbol;

    } else {

        symbol = p2Symbol;

    }


    /*
       Store symbol in board.
    */
    board[index] = symbol;


    /*
       Display symbol.
    */
    cell.textContent = symbol;


    /*
       Add X or O CSS class.
    */
    cell.classList.add(
        symbol.toLowerCase()
    );


    /*
       Disable this cell.
    */
    cell.disabled = true;


    /*
       Check whether someone won.
    */
    const winningPattern =
        checkWinner();


    if (winningPattern !== null) {

        handleWinner(winningPattern);

        return;
    }


    /*
       If there are no empty cells,
       it is a draw.
    */
    if (!board.includes("")) {

        handleDraw();

        return;
    }


    /*
       Change player.
    */
    if (currentPlayer === 1) {

        currentPlayer = 2;

    } else {

        currentPlayer = 1;

    }


    /*
       Update turn display.
    */
    updateTurn();

}


/* =========================================
   CHECK WINNER
========================================= */

function checkWinner() {

    /*
       Check all 8 winning combinations.
    */
    for (
        const pattern of winningPatterns
    ) {

        const a = pattern[0];
        const b = pattern[1];
        const c = pattern[2];


        /*
           Example:

           board[0] = X
           board[1] = X
           board[2] = X

           Therefore X wins.
        */
        if (
            board[a] !== "" &&
            board[a] === board[b] &&
            board[a] === board[c]
        ) {

            return pattern;

        }

    }


    /*
       No winner.
    */
    return null;

}


/* =========================================
   HANDLE WINNER
========================================= */

function handleWinner(winningPattern) {

    /*
       Stop the game.
    */
    gameActive = false;


    /*
       Store the player who created
       the winning line.
    */
    const winningPlayer =
        currentPlayer;


    /*
       YOUR REQUEST:
       The OTHER player gets the point.

       If Player 1 creates the line,
       Player 2 gets the point.

       If Player 2 creates the line,
       Player 1 gets the point.
    */

    if (winningPlayer === 1) {

        score2++;

    } else {

        score1++;

    }


    /*
       Update scoreboard.
    */
    updateScores();


    /*
       Draw the strike line.
    */
    drawStrike(winningPattern);


    /*
       Find winning player's name.
    */
    let winningPlayerName;

    if (winningPlayer === 1) {

        winningPlayerName =
            player1Name;

    } else {

        winningPlayerName =
            player2Name;

    }


    /*
       Find player receiving the point.
    */
    let pointPlayerName;

    if (winningPlayer === 1) {

        pointPlayerName =
            player2Name;

    } else {

        pointPlayerName =
            player1Name;

    }


    /*
       Display result.
    */
    result.innerHTML =
        `${winningPlayerName} made a line!<br>
         Point goes to ${pointPlayerName}.`;


    /*
       Round is over.
    */
    statusText.textContent =
        "Round Over";


    /*
       Disable board.
    */
    disableBoard();


    /*
       Check overall winner.
    */
    checkFinalWinner();

}


/* =========================================
   HANDLE DRAW
========================================= */

function handleDraw() {

    gameActive = false;


    statusText.textContent =
        "It's a draw!";


    result.textContent =
        "No points awarded.";

}


/* =========================================
   DRAW WINNING STRIKE
========================================= */

function drawStrike(pattern) {

    /*
       Get board position.
    */
    const boardElement =
        document.getElementById("board");


    const boardRect =
        boardElement.getBoundingClientRect();


    /*
       First and last cells of
       winning combination.
    */
    const firstCell =
        cells[pattern[0]];

    const lastCell =
        cells[pattern[2]];


    const firstRect =
        firstCell.getBoundingClientRect();

    const lastRect =
        lastCell.getBoundingClientRect();


    /*
       Center of first cell.
    */
    const x1 =
        firstRect.left -
        boardRect.left +
        firstRect.width / 2;

    const y1 =
        firstRect.top -
        boardRect.top +
        firstRect.height / 2;


    /*
       Center of last cell.
    */
    const x2 =
        lastRect.left -
        boardRect.left +
        lastRect.width / 2;

    const y2 =
        lastRect.top -
        boardRect.top +
        lastRect.height / 2;


    /*
       Calculate distance between
       first and last cells.
    */
    const dx = x2 - x1;
    const dy = y2 - y1;


    const length =
        Math.sqrt(
            dx * dx +
            dy * dy
        );


    /*
       Calculate angle.
    */
    const angle =
        Math.atan2(dy, dx) *
        180 /
        Math.PI;


    /*
       Position strike line.
    */
    strike.style.left =
        `${x1}px`;

    strike.style.top =
        `${y1}px`;

    strike.style.width =
        `${length}px`;

    strike.style.transform =
        `rotate(${angle}deg)`;


    /*
       Show strike.
    */
    strike.style.display =
        "block";


    /*
       Start animation.
    */
    setTimeout(function() {

        strike.classList.add("show");

    }, 50);

}


/* =========================================
   UPDATE TURN
========================================= */

function updateTurn() {

    let name;
    let symbol;


    if (currentPlayer === 1) {

        name = player1Name;
        symbol = p1Symbol;

    } else {

        name = player2Name;
        symbol = p2Symbol;

    }


    statusText.textContent =
        `${name}'s turn (${symbol})`;


    /*
       Highlight active player.
    */
    player1Card.classList.toggle(
        "active",
        currentPlayer === 1
    );

    player2Card.classList.toggle(
        "active",
        currentPlayer === 2
    );

}


/* =========================================
   UPDATE SCORES
========================================= */

function updateScores() {

    score1Element.textContent =
        score1;

    score2Element.textContent =
        score2;

}


/* =========================================
   DISABLE BOARD
========================================= */

function disableBoard() {

    cells.forEach(function(cell) {

        cell.disabled = true;

    });

}


/* =========================================
   CHECK FINAL WINNER
========================================= */

function checkFinalWinner() {

    /*
       First player to reach 3 points
       wins the complete game.
    */

    if (score1 >= 3) {

        endGame(player1Name);

        return;

    }


    if (score2 >= 3) {

        endGame(player2Name);

        return;

    }

}


/* =========================================
   FINAL WINNER
========================================= */

function endGame(winnerName) {

    gameActive = false;


    result.innerHTML =
        `🏆 ${winnerName} is the Winner!`;


    statusText.textContent =
        "Game Over";


    disableBoard();

}


/* =========================================
   NEXT ROUND BUTTON
========================================= */

nextRoundBtn.addEventListener(
    "click",
    startRound
);


/* =========================================
   RESET GAME BUTTON
========================================= */

resetGameBtn.addEventListener(
    "click",
    resetGame
);


function resetGame() {

    /*
       Reset scores.
    */
    score1 = 0;
    score2 = 0;

    updateScores();


    /*
       Go back to setup screen.
    */
    game.style.display = "none";

    setup.style.display = "block";


    /*
       Clear names.
    */
    player1NameInput.value = "";
    player2NameInput.value = "";


    /*
       Default symbols.
    */
    p1Symbol = "X";
    p2Symbol = "O";


    /*
       Select X button again.
    */
    symbolButtons.forEach(function(button) {

        button.classList.remove(
            "selected"
        );

    });


    symbolButtons[0].classList.add(
        "selected"
    );


    /*
       Clear messages.
    */
    result.textContent = "";

    errorMessage.textContent = "";

}


/* =========================================
   INITIAL SETUP
========================================= */

updateScores();