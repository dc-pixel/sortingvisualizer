"use strict";

const state = {
  values: [],
  sorting: false,
  operations: 0,
  startedAt: 0,
  timerId: null,
};

const $ = (selector) => document.querySelector(selector);

const elements = {
  algorithm: $("#algorithm"),
  arraySize: $("#arraySize"),
  sizeValue: $("#sizeValue"),
  speed: $("#speed"),
  speedValue: $("#speedValue"),
  array: $("#array"),
  generate: $("#generateBtn"),
  sort: $("#sortBtn"),
  status: $("#statusText"),
  operationCount: $("#operationCount"),
  elapsedTime: $("#elapsedTime"),
  algorithmName: $("#algorithmName"),
  complexity: $("#complexity"),
  stable: $("#stable"),
  inPlace: $("#inPlace"),
  emptyState: $("#emptyState"),
};

const algorithmInfo = {
  bubble: { name: "Bubble Sort", complexity: "O(n²)", stable: "Yes", inPlace: "Yes" },
  selection: { name: "Selection Sort", complexity: "O(n²)", stable: "No", inPlace: "Yes" },
  insertion: { name: "Insertion Sort", complexity: "O(n²)", stable: "Yes", inPlace: "Yes" },
  merge: { name: "Merge Sort", complexity: "O(n log n)", stable: "Yes", inPlace: "No" },
  quick: { name: "Quick Sort", complexity: "O(n log n)", stable: "No", inPlace: "Yes" },
};

function randomArray(size) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
}

function render(values = state.values) {
  elements.array.innerHTML = "";
  elements.emptyState.hidden = values.length > 0;

  const fragment = document.createDocumentFragment();
  values.forEach((value, index) => {
    const bar = document.createElement("div");
    bar.className = "cell";
    bar.dataset.index = String(index);
    bar.setAttribute("value", String(value));
    bar.setAttribute("aria-label", `Value ${value}`);
    bar.style.height = `${Math.max(4, value * 0.92)}%`;
    fragment.appendChild(bar);
  });
  elements.array.appendChild(fragment);
}

function setStatus(text, active = false) {
  elements.status.textContent = text;
  elements.status.parentElement.classList.toggle("is-active", active);
}

function updateAlgorithmInfo() {
  const info = algorithmInfo[elements.algorithm.value];
  elements.algorithmName.textContent = info.name;
  elements.complexity.textContent = info.complexity;
  elements.stable.textContent = info.stable;
  elements.inPlace.textContent = info.inPlace;
}

function updateControls() {
  const disabled = state.sorting;
  elements.algorithm.disabled = disabled;
  elements.arraySize.disabled = disabled;
  elements.speed.disabled = disabled;
  elements.generate.disabled = disabled;
  elements.sort.disabled = disabled;
  elements.sort.textContent = disabled ? "Sorting…" : "Start Sorting";
}

function updateStats() {
  elements.operationCount.textContent = `${state.operations} operation${state.operations === 1 ? "" : "s"}`;
  const seconds = state.startedAt ? (performance.now() - state.startedAt) / 1000 : 0;
  elements.elapsedTime.textContent = `${seconds.toFixed(1)}s`;
}

function startTimer() {
  state.startedAt = performance.now();
  state.timerId = window.setInterval(updateStats, 100);
}

function stopTimer() {
  if (state.timerId) window.clearInterval(state.timerId);
  state.timerId = null;
  updateStats();
}

function generateArray() {
  state.values = randomArray(Number(elements.arraySize.value));
  state.operations = 0;
  state.startedAt = 0;
  updateStats();
  render();
  setStatus("Ready");
}

async function startSorting() {
  if (state.sorting || !state.values.length) return;

  state.sorting = true;
  state.operations = 0;
  updateControls();
  setStatus(`Running ${algorithmInfo[elements.algorithm.value].name}`, true);
  startTimer();

  const list = Array.from(elements.array.children);
  const speed = Number(elements.speed.value);
  const helper = new Helper(speed, list, () => {
    state.operations += 1;
    updateStats();
  });
  const sorter = new SortAlgorithms(speed, list, helper);

  try {
    await sorter.run(elements.algorithm.value);
    await sorter.finish();
    setStatus("Sorted");
  } catch (error) {
    console.error(error);
    setStatus("Something went wrong");
  } finally {
    state.sorting = false;
    stopTimer();
    updateControls();
  }
}

elements.arraySize.addEventListener("input", () => {
  elements.sizeValue.textContent = elements.arraySize.value;
});

elements.arraySize.addEventListener("change", generateArray);

elements.speed.addEventListener("input", () => {
  elements.speedValue.textContent = `${Number(elements.speed.value).toFixed(2).replace(/0$/, "")}×`;
});

elements.algorithm.addEventListener("change", updateAlgorithmInfo);
elements.generate.addEventListener("click", generateArray);
elements.sort.addEventListener("click", startSorting);

updateAlgorithmInfo();
generateArray();
