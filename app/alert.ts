import document from "document";
import asap from "fitbit-asap/app";
import {vibration} from "haptics";
import type {Glucose} from "../types/message";

let vibrationInterval: ReturnType<typeof setInterval>;

export function drawAlert(glucose: Glucose) {
  console.error(JSON.stringify(glucose));

  if (glucose.alert.prevDismissed === true) {
    clearInterval(vibrationInterval);
    return;
  };
  if (glucose.alert.enabled === false) return;
  if (glucose.alert.active === false) return;

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

  // Start vibration
  vibrationInterval = setInterval(() => {
    vibration.start("nudge-max");
  }, 2_000);

  const muteButtonElm = document.getElementById("MuteButton");
  // @ts-ignore
  muteButtonElm.onclick = () => {
    clearInterval(vibrationInterval);

    hideAlertDisplay();
    showMainDisplay();

    asap.send({type: "alert-dismissed", bg: glucose[glucose.unit]});
  }
}
