"use strict";

class SortAlgorithms {
  constructor(speed, list, helper) {
    this.speed = Number(speed) || 1;
    this.list = list;
    this.size = list.length;
    this.help = helper || new Helper(this.speed, list);
  }

  finish = async () => {
    for (const node of this.list) {
      node.classList.remove("current", "min");
      node.classList.add("done");
    }
  };

  bubbleSort = async () => {
    for (let i = 0; i < this.size - 1; i += 1) {
      let swapped = false;
      for (let j = 0; j < this.size - i - 1; j += 1) {
        await this.help.mark(j);
        await this.help.mark(j + 1);
        if (await this.help.compare(j, j + 1)) {
          await this.help.swap(j, j + 1);
          swapped = true;
        }
        await this.help.unmark(j);
        await this.help.unmark(j + 1);
      }
      this.list[this.size - i - 1].classList.add("done");
      if (!swapped) break;
    }
  };

  insertionSort = async () => {
    for (let i = 1; i < this.size; i += 1) {
      let j = i;
      while (j > 0) {
        await this.help.mark(j - 1);
        await this.help.mark(j);
        if (!(await this.help.compare(j - 1, j))) {
          await this.help.unmark(j - 1);
          await this.help.unmark(j);
          break;
        }
        await this.help.swap(j - 1, j);
        await this.help.unmark(j - 1);
        await this.help.unmark(j);
        j -= 1;
      }
    }
  };

  selectionSort = async () => {
    for (let i = 0; i < this.size - 1; i += 1) {
      let minIndex = i;
      await this.help.markSpl(minIndex);
      for (let j = i + 1; j < this.size; j += 1) {
        await this.help.mark(j);
        if (await this.help.compare(minIndex, j)) {
          await this.help.unmark(minIndex);
          minIndex = j;
          await this.help.markSpl(minIndex);
        }
        await this.help.unmark(j);
      }
      await this.help.swap(i, minIndex);
      await this.help.unmark(minIndex);
      this.list[i].classList.add("done");
    }
  };

  mergeSort = async () => {
    await this.mergeDivider(0, this.size - 1);
  };

  mergeDivider = async (start, end) => {
    if (start >= end) return;
    const mid = start + Math.floor((end - start) / 2);
    await this.mergeDivider(start, mid);
    await this.mergeDivider(mid + 1, end);
    await this.merge(start, mid, end);
  };

  merge = async (start, mid, end) => {
    const values = [];
    let left = start;
    let right = mid + 1;

    while (left <= mid && right <= end) {
      await this.help.mark(left);
      await this.help.mark(right);
      const leftValue = this.help.getValue(left);
      const rightValue = this.help.getValue(right);
      if (leftValue <= rightValue) {
        values.push(leftValue);
        left += 1;
      } else {
        values.push(rightValue);
        right += 1;
      }
      await this.help.unmark(left - (left > mid ? 0 : 1));
      await this.help.unmark(right - (right > end ? 0 : 1));
    }

    while (left <= mid) {
      values.push(this.help.getValue(left));
      left += 1;
    }
    while (right <= end) {
      values.push(this.help.getValue(right));
      right += 1;
    }

    for (let i = 0; i < values.length; i += 1) {
      const index = start + i;
      this.list[index].classList.add("current");
      await this.help.delay(75);
      this.help.setValue(index, values[i]);
      this.list[index].classList.remove("current");
    }
  };

  quickSort = async () => {
    await this.quickDivider(0, this.size - 1);
  };

  quickDivider = async (start, end) => {
    if (start >= end) return;
    const pivot = await this.partition(start, end);
    await this.quickDivider(start, pivot - 1);
    await this.quickDivider(pivot + 1, end);
  };

  partition = async (start, end) => {
    const pivotValue = this.help.getValue(end);
    let storeIndex = start;
    this.list[end].classList.add("min");

    for (let i = start; i < end; i += 1) {
      await this.help.mark(i);
      await this.help.delay(70);
      if (this.help.getValue(i) < pivotValue) {
        await this.help.swap(i, storeIndex);
        storeIndex += 1;
      }
      await this.help.unmark(i);
    }

    await this.help.swap(storeIndex, end);
    this.list[end].classList.remove("min");
    return storeIndex;
  };

  run = async (algorithm) => {
    switch (algorithm) {
      case "bubble":
        return this.bubbleSort();
      case "selection":
        return this.selectionSort();
      case "insertion":
        return this.insertionSort();
      case "merge":
        return this.mergeSort();
      case "quick":
        return this.quickSort();
      default:
        throw new Error(`Unknown algorithm: ${algorithm}`);
    }
  };
}

// Backward-compatible alias for code that used the original class name.
const sortAlgorithms = SortAlgorithms;
