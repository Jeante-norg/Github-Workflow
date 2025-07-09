const app = document.getElementById("app");

// Inject game UI into #app using template literals
app.innerHTML = `
  <h2>Rock Paper Scissors</h2>
  <div id="scoreboard">
    <span id="player-score">0</span> : <span id="computer-score">0</span>
    <div style="font-size: 0.9em; color: #666;">Player &nbsp;&nbsp; Computer</div>
  </div>
  <div id="round-info">Round 1 of 5</div>
  <div id="choices">
    <button class="choice" data-choice="rock">✊<br>Rock</button>
    <button class="choice" data-choice="paper">✋<br>Paper</button>
    <button class="choice" data-choice="scissors">✌️<br>Scissors</button>
  </div>
  <div id="feedback"></div>
  <button id="reset-btn">Play Again</button>
`;

// Game state variables
let playerScore = 0;
let computerScore = 0;
let round = 1;
const maxRounds = 5;
const choices = ["rock", "paper", "scissors"];

// DOM elements
const playerScoreSpan = document.getElementById("player-score");
const computerScoreSpan = document.getElementById("computer-score");
const roundInfo = document.getElementById("round-info");
const feedback = document.getElementById("feedback");
const resetBtn = document.getElementById("reset-btn");
const choiceButtons = document.querySelectorAll(".choice");

// Function to get computer's random choice
function getComputerChoice() {
  const index = Math.floor(Math.random() * choices.length);
  return choices[index];
}

// Function to determine round result
function getResult(player, computer) {
  if (player === computer) return "tie";
  if (
    (player === "rock" && computer === "scissors") ||
    (player === "paper" && computer === "rock") ||
    (player === "scissors" && computer === "paper")
  )
    return "win";
  return "lose";
}

// Function to update scores on screen
function updateScores() {
  playerScoreSpan.textContent = playerScore;
  computerScoreSpan.textContent = computerScore;
}

// Function to update round number
function updateRoundInfo() {
  roundInfo.textContent = `Round ${round} of ${maxRounds}`;
}

// Show message after each round
function showFeedback(result, player, computer) {
  let message = "";
  if (result === "win") {
    message = `You chose <b>${player}</b>, Computer chose <b>${computer}</b>. <span style="color:green;">You win this round!</span>`;
  } else if (result === "lose") {
    message = `You chose <b>${player}</b>, Computer chose <b>${computer}</b>. <span style="color:red;">Computer wins this round!</span>`;
  } else {
    message = `You both chose <b>${player}</b>. <span style="color:orange;">It's a tie!</span>`;
  }
  feedback.innerHTML = message;
}

// Final game result after 5 rounds
function endGame() {
  let finalMessage = "";
  if (playerScore > computerScore) {
    finalMessage = `<span style="color:green;">Congratulations! You Won The Game!</span>`;
  } else if (playerScore < computerScore) {
    finalMessage = `<span style="color:red;">Game Over! Computer Wins The Game!</span>`;
  } else {
    finalMessage = `<span style="color:orange;">It's a Tie Game! Try Again!</span>`;
  }
  feedback.innerHTML = finalMessage;
  choiceButtons.forEach((btn) => (btn.disabled = true));
  resetBtn.style.display = "inline-block";
}

// Handle player button click
function handleChoice(e) {
  if (round > maxRounds) return;

  const playerChoice = e.currentTarget.getAttribute("data-choice");
  const computerChoice = getComputerChoice();
  const result = getResult(playerChoice, computerChoice);

  if (result === "win") playerScore++;
  else if (result === "lose") computerScore++;

  updateScores();
  showFeedback(result, playerChoice, computerChoice);

  if (round === maxRounds) {
    setTimeout(endGame, 600);
  }

  round++;
  updateRoundInfo();
}

// Reset the game to initial state
function resetGame() {
  playerScore = 0;
  computerScore = 0;
  round = 1;
  updateScores();
  updateRoundInfo();
  feedback.innerHTML = "";
  choiceButtons.forEach((btn) => (btn.disabled = false));
  resetBtn.style.display = "none";
}

// Add event listeners
choiceButtons.forEach((button) =>
  button.addEventListener("click", handleChoice)
);
resetBtn.addEventListener("click", resetGame);

// Initial state setup
updateScores();
updateRoundInfo();
resetBtn.style.display = "none";

const winSound = new Audio(
  "assets/win.mp3" // Replace with your win sound URL
);
const loseSound = new Audio(
  "assets/lose.mp3" // Replace with your lose sound URL
);
const tieSound = new Audio(
  "assets/tie.mp3" // Replace with your tie sound URL
);

// Play different sounds for win, lose, tie
function playResultSound(result) {
  if (result === "win") {
    winSound.currentTime = 0;
    winSound.play();
  } else if (result === "lose") {
    loseSound.currentTime = 0;
    loseSound.play();
  } else {
    tieSound.currentTime = 0;
    tieSound.play();
  }
}

// Patch handleChoice to play sound
const originalHandleChoice = handleChoice;
function handleChoiceWithSound(e) {
  if (round > maxRounds) return;

  const playerChoice = e.currentTarget.getAttribute("data-choice");
  const computerChoice = getComputerChoice();
  const result = getResult(playerChoice, computerChoice);

  playResultSound(result);

  if (result === "win") playerScore++;
  else if (result === "lose") computerScore++;

  updateScores();
  showFeedback(result, playerChoice, computerChoice);

  if (round === maxRounds) {
    setTimeout(endGame, 600);
  }

  round++;
  updateRoundInfo();
}

// Remove previous listeners and add new ones
choiceButtons.forEach((button) => {
  button.removeEventListener("click", handleChoice);
  button.addEventListener("click", handleChoiceWithSound);
});
function addWinnerGlow(button) {
  button.classList.add("winner-glow");
  setTimeout(() => {
    button.classList.remove("winner-glow");
  }, 500);
}

// Patch handleChoiceWithSound to add winner-glow on win
function handleChoiceWithGlow(e) {
  if (round > maxRounds) return;

  const playerChoice = e.currentTarget.getAttribute("data-choice");
  const computerChoice = getComputerChoice();
  const result = getResult(playerChoice, computerChoice);

  playResultSound(result);

  if (result === "win") {
    playerScore++;
    addWinnerGlow(e.currentTarget);
  } else if (result === "lose") {
    computerScore++;
  }

  updateScores();
  showFeedback(result, playerChoice, computerChoice);

  if (round === maxRounds) {
    setTimeout(endGame, 600);
  }

  round++;
  updateRoundInfo();
}

// Remove previous listeners and add new ones
choiceButtons.forEach((button) => {
  button.removeEventListener("click", handleChoiceWithSound);
  button.addEventListener("click", handleChoiceWithGlow);
});

// Example CSS for winner-glow (add to your stylesheet):
// .winner-glow {
//   box-shadow: 0 0 12px 4px #4ade80, 0 0 0 2px #22c55e;
//   transition: box-shadow 0.2s;
// }
function animateFeedback() {
  feedback.classList.add("feedback-animate");
  setTimeout(() => {
    feedback.classList.remove("feedback-animate");
  }, 600);
}

// Patch showFeedback to add animation after updating feedback
const originalShowFeedback = showFeedback;
function showFeedbackWithAnimation(result, player, computer) {
  originalShowFeedback(result, player, computer);
  animateFeedback();
}

// Replace all usages of showFeedback with showFeedbackWithAnimation
function patchShowFeedbackInHandlers() {
  // Patch in handleChoiceWithGlow
  choiceButtons.forEach((button) => {
    button.removeEventListener("click", handleChoiceWithGlow);
    button.addEventListener("click", function (e) {
      if (round > maxRounds) return;

      const playerChoice = e.currentTarget.getAttribute("data-choice");
      const computerChoice = getComputerChoice();
      const result = getResult(playerChoice, computerChoice);

      playResultSound(result);

      if (result === "win") {
        playerScore++;
        addWinnerGlow(e.currentTarget);
      } else if (result === "lose") {
        computerScore++;
      }

      updateScores();
      showFeedbackWithAnimation(result, playerChoice, computerChoice);

      if (round === maxRounds) {
        setTimeout(endGame, 600);
      }

      round++;
      updateRoundInfo();
    });
  });
}

patchShowFeedbackInHandlers();
