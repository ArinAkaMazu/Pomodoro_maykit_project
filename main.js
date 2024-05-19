const timer = {
  pomodoro: 1500,
  shortBreak: 300,
  longBreak: 900,
  longBreakInterval: 4,
  sessions: 0,
};

let interval;

const mainButton = document.getElementById("js-btn");
const decreaseButton = document.getElementById("js-decrease");
const increaseButton = document.getElementById("js-increase");
const fullscreenButton = document.getElementById("js-fullscreen");

mainButton.addEventListener("click", () => {
  const { action } = mainButton.dataset;
  if (action === "start") {
    startTimer();
  } else {
    stopTimer();
  }
});

decreaseButton.addEventListener("click", () => {
  if (timer.pomodoro > 300) {
    timer.pomodoro -= 300;
    if (timer.mode === "pomodoro") {
      switchMode("pomodoro");
    }
  }
});

increaseButton.addEventListener("click", () => {
  timer.pomodoro += 300;
  if (timer.mode === "pomodoro") {
    switchMode("pomodoro");
  }
});

fullscreenButton.addEventListener("click", () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
  }
});

const buttonSound = document.getElementById("button-sound");
fullscreenButton.addEventListener("click", () => {
  buttonSound.play();
});

document.addEventListener("DOMContentLoaded", () => {
  switchMode("pomodoro");
});

const modeButtons = document.querySelector("#js-mode-buttons");
modeButtons.addEventListener("click", handleMode);

function handleMode(event) {
  const { mode } = event.target.dataset;

  if (!mode) return;

  timer.mode = mode;
  switchMode(mode);
  stopTimer();
}

function switchMode(mode) {
  timer.remainingTime = {
    total: timer[mode],
    minutes: Math.floor(timer[mode] / 60),
    seconds: timer[mode] % 60,
  };

  document
    .querySelectorAll("button[data-mode]")
    .forEach((e) => e.classList.remove("active"));
  document.querySelector(`[data-mode="${mode}"]`).classList.add("active");
  document.body.style.backgroundColor = `var(--${mode})`;
  updateClock();
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

function startTimer() {
  const { total } = timer.remainingTime;
  const endTime = Date.parse(new Date()) + total * 1000;

  mainButton.dataset.action = "stop";
  mainButton.textContent = "Stop";
  mainButton.classList.add("active");

  interval = setInterval(function () {
    timer.remainingTime = getRemainingTime(endTime);
    updateClock();

    if (timer.remainingTime.total <= 0) {
      clearInterval(interval);

      switch (timer.mode) {
        case "pomodoro":
          timer.sessions++;

          if (timer.sessions % timer.longBreakInterval === 0) {
            switchMode("longBreak");
          } else {
            switchMode("shortBreak");
          }
          break;
        default:
          switchMode("pomodoro");
      }

      document.querySelector(`[data-sound="${timer.mode}"]`).play();

      startTimer();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(interval);

  mainButton.dataset.action = "start";
  mainButton.textContent = "Start";
  mainButton.classList.remove("active");
}

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
