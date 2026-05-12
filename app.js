const breathCircle = document.getElementById('breathCircle');
const breathPhase = document.getElementById('breathPhase');
const breathCount = document.getElementById('breathCount');
const cycleCount = document.getElementById('cycleCount');
const totalTime = document.getElementById('totalTime');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const modeBtns = document.querySelectorAll('.mode-btn');

let config = { inhale: 4, hold: 2, exhale: 6, name: '腹式呼吸' };
let running = false;
let cycles = 0;
let elapsed = 0;
let timerInterval = null;
let phaseTimeout = null;

// Mode selection
modeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    if (running) return;
    modeBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    config = {
      inhale: parseInt(btn.dataset.inhale),
      hold: parseInt(btn.dataset.hold),
      exhale: parseInt(btn.dataset.exhale),
      name: btn.dataset.name
    };
    reset();
  });
});

startBtn.addEventListener('click', () => {
  if (running) {
    pause();
  } else {
    start();
  }
});

resetBtn.addEventListener('click', reset);

function start() {
  running = true;
  startBtn.textContent = '暫停';
  timerInterval = setInterval(() => {
    elapsed++;
    totalTime.textContent = `時間：${elapsed}s`;
  }, 1000);
  runCycle();
}

function pause() {
  running = false;
  startBtn.textContent = '繼續';
  clearInterval(timerInterval);
  clearTimeout(phaseTimeout);
  breathCircle.className = 'breath-circle';
  breathPhase.textContent = '暫停';
  breathCount.textContent = '';
}

function reset() {
  running = false;
  clearInterval(timerInterval);
  clearTimeout(phaseTimeout);
  cycles = 0;
  elapsed = 0;
  startBtn.textContent = '開始';
  breathCircle.className = 'breath-circle';
  breathPhase.textContent = '準備';
  breathCount.textContent = '';
  cycleCount.textContent = '循環：0';
  totalTime.textContent = '時間：0s';
}

function runCycle() {
  if (!running) return;
  doPhase('吸氣', config.inhale, 'inhale', () => {
    if (config.hold > 0) {
      doPhase('屏息', config.hold, 'hold', () => {
        doPhase('呼氣', config.exhale, 'exhale', () => {
          cycles++;
          cycleCount.textContent = `循環：${cycles}`;
          runCycle();
        });
      });
    } else {
      doPhase('呼氣', config.exhale, 'exhale', () => {
        cycles++;
        cycleCount.textContent = `循環：${cycles}`;
        runCycle();
      });
    }
  });
}

function doPhase(label, duration, cssClass, callback) {
  if (!running) return;
  breathCircle.className = `breath-circle ${cssClass}`;
  breathPhase.textContent = label;

  let remaining = duration;
  breathCount.textContent = remaining;

  const tick = setInterval(() => {
    if (!running) {
      clearInterval(tick);
      return;
    }
    remaining--;
    breathCount.textContent = remaining > 0 ? remaining : '';
    if (remaining <= 0) {
      clearInterval(tick);
      phaseTimeout = setTimeout(callback, 100);
    }
  }, 1000);
}
