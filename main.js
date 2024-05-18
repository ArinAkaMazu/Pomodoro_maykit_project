const timer = {
  pomodoro: 30,
  shortBreak: 5,
  longBreak: 15,
  longBreakInterval: 4,
};
let interval;
const mainButton = document.getElementById("js-btn");
mainButton.addEventListener("click", () => {
  playButtonClickSound(); // Play sound on button click
  const { action } = mainButton.dataset;
  if (action === "start") {
    startTimer();
  } else {
    stopTimer();
  }
});

const modeButtons = document.querySelector("#js-mode-buttons");
modeButtons.addEventListener("click", (event) => {
  playButtonClickSound(); // Play sound on button click
  handleMode(event);
});

// Load the sound files
const alarmSound = new Audio("break.mp3");
const buttonClickSound = new Audio("button-sound.mp3");

function getRemainingTime(endTime) {
  const currentTime = Date.parse(new Date());
  const difference = endTime - currentTime;
  const total = Number.parseInt(difference / 1000, 10);
  const minutes = Number.parseInt((total / 60) % 60, 10);
  const seconds = Number.parseInt(total % 60, 10);
  return {
    total,
    minutes,
    seconds,
  };
}

function startTimer() {
  let { total } = timer.remainingTime;
  const endTime = Date.parse(new Date()) + total * 1000;
  mainButton.dataset.action = "stop";
  mainButton.textContent = "stop";
  mainButton.classList.add("active");
  interval = setInterval(function () {
    timer.remainingTime = getRemainingTime(endTime);
    updateClock();

    total = timer.remainingTime.total;
    if (total <= 0) {
      clearInterval(interval);
      alarmSound.play(); // Play sound when timer ends
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(interval);
  mainButton.dataset.action = "start";
  mainButton.textContent = "start";
  mainButton.classList.remove("active");
}

function updateClock() {
  const { remainingTime } = timer;
  const minutes = `${remainingTime.minutes}`.padStart(2, "0");
  const seconds = `${remainingTime.seconds}`.padStart(2, "0");

  const min = document.getElementById("js-minutes");
  const sec = document.getElementById("js-seconds");
  min.textContent = minutes;
  sec.textContent = seconds;
}

function switchMode(mode) {
  timer.mode = mode;
  timer.remainingTime = {
    total: timer[mode] * 60,
    minutes: timer[mode],
    seconds: 0,
  };
  document
    .querySelectorAll("button[data-mode]")
    .forEach((e) => e.classList.remove("active"));
  document.querySelector(`[data-mode="${mode}"]`).classList.add("active");
  document.body.style.backgroundColor = `var(--${mode})`;

  updateClock();
}

function handleMode(event) {
  const { mode } = event.target.dataset;
  if (!mode) return;
  switchMode(mode);
  stopTimer();
}

function playButtonClickSound() {
  buttonClickSound.play();
}

document.addEventListener("DOMContentLoaded", () => {
  switchMode("pomodoro");
});
