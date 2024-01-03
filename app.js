// GAME CONFIG
const MAX_ROUND = 5;

let roundNumber = 0;
let playerScore = 0,
    computerScore = 0;

let isFlipped = false;

const roundDisplay = document.getElementById("round-number");
const playerScoreDisplay = document.getElementById("player-score");
const computerScoreDisplay = document.getElementById("computer-score");

const playerCard = document.getElementById("player-playcard");
const computerCard = document.getElementById("computer-playcard");

const rockButton = document.getElementById("rock");
const paperButton = document.getElementById("paper");
const scissorsButton = document.querySelector("#scissors");

const winnerPopup = document.querySelector(".result-popup");
const restartButton = document.querySelector("#restart-button");

document.querySelector(".game-prompt").textContent =
    "First to " + MAX_ROUND + " WINS!";

// UI and Varible UPDATES
function updateRound(number) {
    roundNumber = number;
    roundDisplay.textContent = roundNumber;
}

function updatePlayerScore(score) {
    playerScore = score;
    playerScoreDisplay.textContent = playerScore;
}

function updateComputerScore(score) {
    computerScore = score;
    computerScoreDisplay.textContent = computerScore;
}

function enableButtons(bool = true) {
    document
        .querySelectorAll("button.action")
        .forEach((element) => (element.disabled = !bool));
}

function displayChoice(element, choice) {
    let sign;
    switch (choice.toUpperCase()) {
        case "ROCK":
            sign = "✊";
            break;
        case "PAPER":
            sign = "✋";
            break;
        case "SCISSORS":
            sign = "✌";
            break;
    }
    element.textContent = sign;
}

function showResult(result) {
    switch (result) {
        case 1:
            playerCard.parentNode.style.backgroundColor = "#29abe2";
            computerCard.parentNode.style.backgroundColor = "#f0f0f0";
            break;
        case -1:
            computerCard.parentNode.style.backgroundColor = "#29abe2";
            playerCard.parentNode.style.backgroundColor = "#f0f0f0";
            break;
        case 0:
            computerCard.parentNode.style.backgroundColor = "#f0f0f0";
            playerCard.parentNode.style.backgroundColor = "#f0f0f0";
            break;
    }
}

function hideComputerCard() {
    if (isFlipped) {
        computerCard.parentElement.parentElement.classList.toggle("is-flipped");
        isFlipped = false;
    }
}

function revealComputerCard(computerSelection) {
    if (isFlipped) {
        computerCard.parentElement.parentElement.classList.toggle("is-flipped");

        setTimeout(function () {
            displayChoice(computerCard, computerSelection);
            computerCard.parentElement.parentElement.classList.toggle(
                "is-flipped"
            );
            isFlipped = true;
        }, 500);
    } else {
        displayChoice(computerCard, computerSelection);
        computerCard.parentElement.parentElement.classList.toggle("is-flipped");
        isFlipped = true;
    }
}

// Game
function initGame() {
    updateRound(1);
    updatePlayerScore(0);
    updateComputerScore(0);

    enableButtons();
    winnerPopup.style.display = "none";

    displayChoice(playerCard, "");
    displayChoice(computerCard, "");
    hideComputerCard();

    playerCard.parentNode.style.backgroundColor = "#f0f0f0";
    computerCard.parentNode.style.backgroundColor = "#f0f0f0";
}

function getComputerChoice() {
    let idx = Math.floor(Math.random() * 3);
    let choices = ["ROCK", "PAPER", "SCISSORS"];
    return choices[idx];
}

function playRound(playerSelection, computerSelection) {
    // returns
    // 1 if player wins!
    // 0 if computer wins!
    // -1 if draw

    playerSelection = playerSelection.toUpperCase();
    computerSelection = computerSelection.toUpperCase();

    if (playerSelection === computerSelection) return 0;

    switch (playerSelection) {
        case "ROCK":
            return computerSelection === "SCISSORS" ? 1 : -1;
        case "PAPER":
            return computerSelection === "ROCK" ? 1 : -1;
        case "SCISSORS":
            return computerSelection === "PAPER" ? 1 : -1;
        default:
            return 0;
    }
}

function endGame() {
    enableButtons(false);
    // isFlipped = false;

    let playerWon = playerScore > computerScore;
    if (playerWon) {
        document.getElementById("winner-message").textContent = "You won!";
        document.querySelector(".result-popup").style.backgroundColor =
            "lightgreen";
    } else {
        document.getElementById("winner-message").textContent = "You lost!";
        document.querySelector(".result-popup").style.backgroundColor = "pink";
    }

    winnerPopup.style.display = "flex";
}

// Event listeners

document.querySelectorAll(".action-container > .action").forEach((element) => {
    element.addEventListener("click", () => {
        console.log("start of click: " + isFlipped);

        let playerSelection = element.id;
        let computerSelection = getComputerChoice();

        displayChoice(playerCard, playerSelection);
        revealComputerCard(computerSelection);
        // displayChoice(computerCard, computerSelection);

        let result = playRound(playerSelection, computerSelection);
        showResult(result);

        updateRound(roundNumber + 1);
        if (result === 1) {
            updatePlayerScore(playerScore + 1);
        } else if (result === -1) {
            updateComputerScore(computerScore + 1);
        }

        // End game
        if (playerScore === MAX_ROUND || computerScore === MAX_ROUND) {
            endGame();
        }

        console.log("end of click: " + isFlipped);
    });

    element.addEventListener("mouseover", () => {
        if (!element.disabled) {
            displayChoice(playerCard, element.id);
            playerCard.parentNode.style.backgroundColor = "#f0f0f0";
            displayChoice(computerCard, "");
            computerCard.parentNode.style.backgroundColor = "#f0f0f0";
        }

        if (isFlipped) {
            computerCard.parentElement.parentElement.classList.toggle(
                "is-flipped"
            );
            isFlipped = false;
        }
    });

    element.addEventListener("mouseout", () => {
        if (!element.disabled) {
            if (!isFlipped) {
                displayChoice(playerCard, "");
            }
        }
    });
});

restartButton.addEventListener("click", initGame);

initGame();
