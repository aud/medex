import document from "document";
import asap from "fitbit-asap/app";
import {vibration} from "haptics";
import type {Glucose} from "../types/message";

let vibrationInterval: ReturnType<typeof setInterval>;

function stopVibration() {
  clearInterval(vibrationInterval);
  // Ensure for sanity..
  vibration.stop();
}

export function drawAlert(glucose: Glucose) {
  if (
    glucose.alert.prevDismissed === true ||
    glucose.alert.enabled === false ||
    glucose.alert.active === false
  ) {
    stopVibration();
    return;
  };

  if (vibrationInterval) {
    stopVibration();
  }

  // Draw interface first
  //
  // Hide/show main display
  const mainElm = document.getElementById("Main") as ImageElement;
  const showMainDisplay = () => mainElm.style.display = "inline";
  const hideMainDisplay = () => mainElm.style.display = "none";

  // Hide/show alert display
  const alertElm = document.getElementById("Alert") as ImageElement;
  const showAlertDisplay = () => alertElm.style.display = "inline";
  const hideAlertDisplay = () => alertElm.style.display = "none";

  const valueDetectedElm = document.getElementById("ValueDetected") as TextElement;
  valueDetectedElm.text = glucose[glucose.unit];

  const typeDetectedElm = document.getElementById("TypeDetected") as TextElement;
  typeDetectedElm.text = glucose.alert.type!.charAt(0).toUpperCase() + glucose.alert.type!.slice(1) + " Detected";

  hideMainDisplay();
  showAlertDisplay();

  vibrationInterval = setInterval(() => {
    vibration.start("nudge-max");
  }, 2_000);

  const muteButtonElm = document.getElementById("MuteButton");
  // @ts-ignore
  muteButtonElm.onclick = () => {
    stopVibration();

    hideAlertDisplay();
    showMainDisplay();

    asap.send({type: "alert-dismissed", bg: glucose[glucose.unit]});
  }
}
