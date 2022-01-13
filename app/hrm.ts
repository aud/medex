import document from "document";
import {HeartRateSensor} from "heart-rate";
import {display} from "display";

export function drawHeartRate() {
  const hrElm = document.getElementById("HeartRate") as TextElement;
  hrm((hr: string) => hrElm.text = hr);
}

// https://dev.fitbit.com/build/guides/sensors/heart-rate/
function hrm(callback: Function) {
  // @ts-ignore
  const hrm = new HeartRateSensor({frequency: 1});

  hrm.addEventListener("reading", () => {
    callback(hrm.heartRate);
  });

  // Only track hrm when display is on
  // @ts-ignore
  display.addEventListener("change", () => {
    display.on ? hrm.start() : hrm.stop();
  });

  hrm.start();
}
