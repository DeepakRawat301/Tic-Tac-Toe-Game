let boxes = document.querySelectorAll('.box');
let resetbtn = document.querySelector('#r1');
let newGameBtn = document.querySelector('#r2');
let msgContainer = document.querySelector('.msg-container');
let playerChoiceContainer = document.querySelector('.player-choice');
let userFirstBtn = document.querySelector('#user-first');
let aiFirstBtn = document.querySelector('#ai-first');
let msg = document.querySelector('#msg');
let userScoreElement = document.querySelector('#user-score');
let aiScoreElement = document.querySelector('#ai-score');
let drawScoreElement = document.querySelector('#draw-score');

let board = Array(9).fill("");
let isHumanTurn = true;
let userWins = 0;
let aiWins = 0;
let draws = 0;

// Winning patterns
const winPattern = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

// Reset the game
const resetGame = () => {
    board = Array(9).fill("");
    isHumanTurn = true;
    boxes.forEach((box) => {
        box.innerText = "";
        box.classList.remove('ai');
        box.disabled = false;
    });
    msgContainer.classList.add('hide');
    playerChoiceContainer.style.display = "block"; // Show the choice prompt
};

// Check for a winner
const checkWinner = (board) => {
    for (let pattern of winPattern) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a]; // Return "X" or "O" as the winner
        }
    }
    return board.includes("") ? null : "Draw"; // Return "Draw" if no empty spaces
};

// Show the winner
const showWinner = (winner) => {
    if (winner === "Draw") {
        msg.innerText = "It's a draw!";
        draws++;
        drawScoreElement.textContent = draws;
    } else if (winner === "X") {
        msg.innerText = "AI wins! Better luck next time.";
        aiWins++;
        aiScoreElement.textContent = aiWins;
    } else if (winner === "O") {
        msg.innerText = "Congratulations! You win!";
        userWins++;
        userScoreElement.textContent = userWins;
    }
    msgContainer.classList.remove('hide');
    boxes.forEach((box) => (box.disabled = true)); // Disable all boxes
};

// Minimax algorithm for AI
const minimax = (board, isMaximizing) => {
    const winner = checkWinner(board);
    if (winner === "X") return { score: 1 };
    if (winner === "O") return { score: -1 };
    if (winner === "Draw") return { score: 0 };

    const moves = [];
    board.forEach((cell, index) => {
        if (cell === "") {
            const newBoard = [...board];
            newBoard[index] = isMaximizing ? "X" : "O";
            const result = minimax(newBoard, !isMaximizing);
            moves.push({ index, score: result.score });
        }
    });

    if (isMaximizing) {
        return moves.reduce((best, move) => (move.score > best.score ? move : best));
    } else {
        return moves.reduce((best, move) => (move.score < best.score ? move : best));
    }
};

// AI's turn
const aiTurn = () => {
    const bestMove = minimax(board, true);
    board[bestMove.index] = "X";
    boxes[bestMove.index].innerText = "X";
    boxes[bestMove.index].classList.add('ai');
    boxes[bestMove.index].disabled = true;

    const winner = checkWinner(board);
    if (winner) {
        showWinner(winner);
    } else {
        isHumanTurn = true; // Switch to human's turn
    }
};

// Human's turn
boxes.forEach((box, index) => {
    box.addEventListener("click", () => {
        if (isHumanTurn && board[index] === "") {
            board[index] = "O";
            box.innerText = "O";
            box.disabled = true;

            const winner = checkWinner(board);
            if (winner) {
                showWinner(winner);
            } else {
                isHumanTurn = false; // Switch to AI's turn
                setTimeout(aiTurn, 500); // Delay for better UX
            }
        }
    });
});

// First player selection
userFirstBtn.addEventListener("click", () => {
    playerChoiceContainer.style.display = "none";
    isHumanTurn = true;
});

aiFirstBtn.addEventListener("click", () => {
    playerChoiceContainer.style.display = "none";
    isHumanTurn = false;
    aiTurn(); // AI starts
});

// Attach event listeners to buttons
newGameBtn.addEventListener("click", resetGame);
resetbtn.addEventListener("click", resetGame);

// Initialize game
resetGame();
