import document from "document";
import {today} from "user-activity";
import {display} from "display";
import {sign} from "../common/utils";

const CALLBACK_BUFFER = 3000; // 3s

export function drawSteps() {
  const stepsElm = document.getElementById("Steps") as TextElement;
  steps((count: number) => stepsElm.text = count.toString());
}

function formatSteps(steps: number): string {
  return Math.abs(steps) > 999
    ? sign(steps) * Math.round(Math.abs(steps) / 100) / 10 + "k"
    : (sign(steps) * Math.abs(steps)).toString();
}

function steps(callback: Function) {
  let interval: ReturnType<typeof setTimeout>

  callback(formatSteps(today.adjusted.steps || 0));

  const start = () => {
    interval = setInterval(() => callback(formatSteps(today.adjusted.steps || 0)), CALLBACK_BUFFER);
  };
  const stop = () => clearInterval(interval);

  // @ts-ignore
  display.addEventListener("change", () => {
    display.on ? start() : stop();
  });

  start();
}
