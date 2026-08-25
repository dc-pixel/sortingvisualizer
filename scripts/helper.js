"use strict";

class Helper {
  constructor(speed = 1, list = [], onOperation = () => {}) {
    this.speed = Number(speed) || 1;
    this.list = list;
    this.onOperation = onOperation;
  }

  delay = async (base = 110) => {
    const milliseconds = Math.max(10, base / this.speed);
    await new Promise((resolve) => setTimeout(resolve, milliseconds));
  };

  pause = async () => this.delay();

  getValue = (index) => Number(this.list[index]?.getAttribute("value"));

  mark = async (index) => {
    if (!this.list[index]) return;
    this.list[index].classList.add("current");
  };

  markSpl = async (index) => {
    if (!this.list[index]) return;
    this.list[index].classList.add("min");
  };

  unmark = async (index) => {
    if (!this.list[index]) return;
    this.list[index].classList.remove("current", "min");
  };

  compare = async (index1, index2) => {
    await this.delay();
    this.onOperation();
    return this.getValue(index1) > this.getValue(index2);
  };

  swap = async (index1, index2) => {
    if (index1 === index2 || !this.list[index1] || !this.list[index2]) return;
    await this.delay();
    this.onOperation();

    const value1 = this.getValue(index1);
    const value2 = this.getValue(index2);
    this.setValue(index1, value2);
    this.setValue(index2, value1);
  };

  setValue = (index, value) => {
    const node = this.list[index];
    if (!node) return;
    node.setAttribute("value", String(value));
    node.style.height = `${Math.max(4, Number(value) * 0.92)}%`;
    node.setAttribute("aria-label", `Value ${value}`);
  };
}
