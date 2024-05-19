// main.js

const timer = {
  pomodoro: 25,
  shortBreak: 5,
  longBreak: 15,
  longBreakInterval: 4,
  remainingTime: {
    total: 0,
    minutes: 0,
    seconds: 0,
  },
};

let interval;
const mainButton = document.getElementById("js-btn");
mainButton.addEventListener("click", () => {
  playButtonSound();
  const { action } = mainButton.dataset;
  if (action === "start") {
    startTimer();
  } else {
    stopTimer();
  }
});

const modeButtons = document.querySelector("#js-mode-buttons");
modeButtons.addEventListener("click", (event) => {
  playButtonSound();
  handleMode(event);
});

const increaseButton = document.getElementById("js-increase");
const decreaseButton = document.getElementById("js-decrease");
increaseButton.addEventListener("click", () => {
  playButtonSound();
  increaseTime();
});
decreaseButton.addEventListener("click", () => {
  playButtonSound();
  decreaseTime();
});

const buttonSound = document.getElementById("button-sound");
const breakSound = document.getElementById("break-sound");

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
  mainButton.textContent = "Stop";
  mainButton.classList.add("active");

  interval = setInterval(function () {
    timer.remainingTime = getRemainingTime(endTime);
    updateClock();

    total = timer.remainingTime.total;
    if (total <= 0) {
      clearInterval(interval);
      breakSound.play();
      switchMode(timer.mode === "pomodoro" ? "shortBreak" : "pomodoro");
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(interval);

  mainButton.dataset.action = "start";
  mainButton.textContent = "Start";
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

function increaseTime() {
  if (timer.mode === "pomodoro") {
    timer.pomodoro += 5;
  } else if (timer.mode === "shortBreak") {
    timer.shortBreak += 5;
  } else if (timer.mode === "longBreak") {
    timer.longBreak += 5;
  }
  switchMode(timer.mode);
}

function decreaseTime() {
  if (timer.mode === "pomodoro" && timer.pomodoro > 5) {
    timer.pomodoro -= 5;
  } else if (timer.mode === "shortBreak" && timer.shortBreak > 5) {
    timer.shortBreak -= 5;
  } else if (timer.mode === "longBreak" && timer.longBreak > 5) {
    timer.longBreak -= 5;
  }
  switchMode(timer.mode);
}

function playButtonSound() {
  buttonSound.currentTime = 0;
  buttonSound.play();
}

document.addEventListener("DOMContentLoaded", () => {
  switchMode("pomodoro");
});
