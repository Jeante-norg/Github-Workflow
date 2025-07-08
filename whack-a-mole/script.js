const holes = document.querySelectorAll(".hole");
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const gameOverText = document.getElementById("game-over");
const restartBtn = document.getElementById("restart");

let score = 0;
let timeLeft = 30;
let moleIntervalTime = 1000;
let moleTimer, countdownTimer, difficultyTimer;
let gameActive = true;

function clearMoles() {
  holes.forEach((hole) => (hole.innerHTML = ""));
}

function showMole() {
  clearMoles();
  const index = Math.floor(Math.random() * holes.length);
  const mole = document.createElement("div");
  mole.classList.add("mole");
  holes[index].appendChild(mole);

  mole.onclick = () => {
    if (!gameActive) return;
    score++;
    scoreDisplay.textContent = score;
    clearMoles();
  };
}

function updateMoleSpeed(newSpeed) {
  clearInterval(moleTimer);
  moleIntervalTime = newSpeed;
  moleTimer = setInterval(() => {
    if (gameActive) showMole();
  }, moleIntervalTime);
}

function startGame() {
  showMole();
  moleTimer = setInterval(showMole, moleIntervalTime);

  countdownTimer = setInterval(() => {
    timeLeft--;
    timeDisplay.textContent = timeLeft;
    if (timeLeft <= 0) endGame();
  }, 1000);

  difficultyTimer = setInterval(() => {
    if (moleIntervalTime > 300) {
      updateMoleSpeed(moleIntervalTime - 200);
    }
  }, 10000);
}

function endGame() {
  gameActive = false;
  clearInterval(moleTimer);
  clearInterval(countdownTimer);
  clearInterval(difficultyTimer);
  clearMoles();
  gameOverText.style.display = "block";
  restartBtn.style.display = "inline-block";
}

// Start immediately
startGame();
