const DEFAULT_OPTIONS = [
  "沙县小吃",
  "面线糊",
  "沙拉拉轻食",
  "沙茶面",
  "木桶饭",
  "塔斯丁",
  "麦当劳",
  "食堂",
  "水煮牛肉",
  "水饺",
  "馄饨",
  "卤肉饭",
  "牛肉羹",
  "粥",
  "鱼片粥",
  "沙拉",
  "番茄鸡蛋面",
  "清汤面",
  "鸡汤米线",
  "越南粉",
  "关东煮",
  "蒸蛋套餐",
  "清蒸鱼饭",
  "轻食三明治",
  "荞麦面",
  "蔬菜汤"
];

const SEGMENT_COLORS = [
  "#ef4444",
  "#facc15",
  "#22c55e",
  "#fb923c",
  "#38bdf8",
  "#f472b6",
  "#a3e635",
  "#f97316",
  "#60a5fa",
  "#fde68a",
  "#34d399",
  "#f87171",
  "#c084fc",
  "#fbbf24"
];

const STORAGE_KEY = "dailyMealWheel:userOptions";
const HIDDEN_STORAGE_KEY = "dailyMealWheel:hiddenDefaultOptions";
const TAU = Math.PI * 2;

const canvas = document.getElementById("meal-wheel");
const ctx = canvas.getContext("2d");
const spinButton = document.getElementById("spin-button");
const resultText = document.getElementById("result-text");
const menuList = document.getElementById("menu-list");
const menuCount = document.getElementById("menu-count");
const optionForm = document.getElementById("option-form");
const optionInput = document.getElementById("option-input");
const formNote = document.getElementById("form-note");

let userOptions = loadUserOptions();
let hiddenDefaultOptions = loadHiddenDefaultOptions();
let options = mergeOptions(DEFAULT_OPTIONS, userOptions);
let rotation = -Math.PI / 2;
let spinning = false;
let noteTimer = null;

function loadUserOptions() {
  return loadStoredList(STORAGE_KEY);
}

function loadHiddenDefaultOptions() {
  return loadStoredList(HIDDEN_STORAGE_KEY);
}

function loadStoredList(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isValidOption) : [];
  } catch {
    return [];
  }
}

function saveUserOptions() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userOptions));
  } catch {
    showNote("浏览器没有保存权限，本次新增会暂时保留。");
  }
}

function saveHiddenDefaultOptions() {
  try {
    localStorage.setItem(HIDDEN_STORAGE_KEY, JSON.stringify(hiddenDefaultOptions));
  } catch {
    showNote("浏览器没有保存权限，本次删除会暂时保留。");
  }
}

function isValidOption(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function normalizeOption(value) {
  return value.trim().replace(/\s+/g, " ");
}

function mergeOptions(baseOptions, extraOptions) {
  const seen = new Set();
  return [...baseOptions, ...extraOptions].reduce((items, item) => {
    const normalized = normalizeOption(item);
    if (!normalized || seen.has(normalized)) return items;
    seen.add(normalized);
    items.push(normalized);
    return items;
  }, []);
}

function rebuildOptions() {
  const visibleDefaults = DEFAULT_OPTIONS.filter((item) => !hiddenDefaultOptions.includes(item));
  options = mergeOptions(visibleDefaults, userOptions);
  renderMenu();
  drawWheel();
  updateSpinAvailability();
}

function drawWheel() {
  const size = canvas.width;
  const center = size / 2;
  const radius = center - 22;

  ctx.clearRect(0, 0, size, size);

  if (options.length === 0) {
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, TAU);
    ctx.fillStyle = "#fff3df";
    ctx.fill();
    ctx.strokeStyle = "#ead4b7";
    ctx.lineWidth = 14;
    ctx.stroke();
    return;
  }

  const segmentAngle = TAU / options.length;

  options.forEach((option, index) => {
    const startAngle = rotation + index * segmentAngle;
    const endAngle = startAngle + segmentAngle;

    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.arc(center, center, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = SEGMENT_COLORS[index % SEGMENT_COLORS.length];
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.84)";
    ctx.lineWidth = 4;
    ctx.stroke();

    drawSegmentLabel(option, startAngle + segmentAngle / 2, radius, center);
  });

  ctx.beginPath();
  ctx.arc(center, center, radius, 0, TAU);
  ctx.strokeStyle = "#fffaf2";
  ctx.lineWidth = 18;
  ctx.stroke();
}

function drawSegmentLabel(option, angle, radius, center) {
  const readableAngle = Math.cos(angle) < 0 ? angle + Math.PI : angle;
  const textAlign = Math.cos(angle) < 0 ? "left" : "right";
  const textOffset = Math.cos(angle) < 0 ? -(radius - 28) : radius - 28;

  ctx.save();
  ctx.translate(center, center);
  ctx.rotate(readableAngle);
  ctx.textAlign = textAlign;
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#321c12";
  ctx.font = "700 26px Microsoft YaHei, PingFang SC, sans-serif";
  ctx.shadowColor = "rgba(255, 255, 255, 0.74)";
  ctx.shadowBlur = 2;
  ctx.fillText(option, textOffset, 0, radius * 0.42);
  ctx.restore();
}

function spinWheel() {
  if (spinning || options.length === 0) return;

  const selectedIndex = Math.floor(Math.random() * options.length);
  const segmentAngle = TAU / options.length;
  const segmentCenter = selectedIndex * segmentAngle + segmentAngle / 2;
  const pointerAngle = -Math.PI / 2;
  const currentNormalized = normalizeAngle(rotation);
  const targetNormalized = normalizeAngle(pointerAngle - segmentCenter);
  const clockwiseDelta = normalizeAngle(targetNormalized - currentNormalized);
  const extraTurns = 5 + Math.floor(Math.random() * 3);
  const startRotation = rotation;
  const targetRotation = rotation + clockwiseDelta + extraTurns * TAU;
  const duration = 3800;
  const startTime = performance.now();

  spinning = true;
  spinButton.disabled = true;
  spinButton.textContent = "转盘转动中";
  resultText.textContent = "转起来了";

  function animate(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = easeOutCubic(progress);
    rotation = startRotation + (targetRotation - startRotation) * eased;
    drawWheel();

    if (progress < 1) {
      requestAnimationFrame(animate);
      return;
    }

    rotation = targetRotation;
    drawWheel();
    spinning = false;
    resultText.textContent = options[selectedIndex];
    spinButton.disabled = false;
    spinButton.textContent = "再转一次";
  }

  requestAnimationFrame(animate);
}

function normalizeAngle(angle) {
  return ((angle % TAU) + TAU) % TAU;
}

function easeOutCubic(value) {
  return 1 - Math.pow(1 - value, 3);
}

function renderMenu() {
  menuList.replaceChildren();
  menuCount.textContent = `${options.length} 项`;

  options.forEach((option) => {
    const tag = document.createElement("div");
    tag.className = "menu-tag";

    const label = document.createElement("span");
    label.textContent = option;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "delete-option";
    button.textContent = "×";
    button.setAttribute("aria-label", `删除 ${option}`);
    button.title = `删除 ${option}`;
    button.addEventListener("click", () => removeOption(option));

    tag.append(label, button);
    menuList.appendChild(tag);
  });
}

function addOption(value) {
  const normalized = normalizeOption(value);
  if (!normalized) {
    showNote("先输入一个想吃的选项。");
    return;
  }

  if (options.includes(normalized)) {
    showNote("这个选项已经在菜单里了。");
    return;
  }

  userOptions.push(normalized);
  saveUserOptions();
  optionInput.value = "";
  rebuildOptions();
  showNote(`已加入：${normalized}`);
}

function removeOption(option) {
  const wasCustom = userOptions.includes(option);
  userOptions = userOptions.filter((item) => item !== option);

  if (!wasCustom) {
    hiddenDefaultOptions = mergeOptions(hiddenDefaultOptions, [option]);
  }

  saveUserOptions();
  saveHiddenDefaultOptions();
  rebuildOptions();

  if (resultText.textContent === option) {
    resultText.textContent = options.length > 0 ? "再转一下" : "暂无选项";
  }
}

function updateSpinAvailability() {
  if (options.length === 0) {
    spinButton.disabled = true;
    spinButton.textContent = "暂无选项";
    resultText.textContent = "暂无选项";
    return;
  }

  if (!spinning) {
    spinButton.disabled = false;
    if (spinButton.textContent === "暂无选项") {
      spinButton.textContent = "开始转盘";
    }
  }
}

function showNote(message) {
  formNote.textContent = message;
  window.clearTimeout(noteTimer);
  noteTimer = window.setTimeout(() => {
    formNote.textContent = "";
  }, 2800);
}

optionForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addOption(optionInput.value);
});

spinButton.addEventListener("click", spinWheel);
window.addEventListener("resize", drawWheel);

rebuildOptions();
