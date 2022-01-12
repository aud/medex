import document from "document";
import {me} from "appbit";
import asap from "fitbit-asap/app";
import {
  humanReadableLastUpdatedTimeSec,
  humanReadableDate,
  assetPathForTrend,
  classifiedStale,
} from "../common/utils";
import {hrm} from "./hrm";
import {steps} from "./steps";
import {clock} from "./clock";
import type {Glucose, Weather, Message} from "../types/message";
import {FitFont} from "fitfont";

let tickerInterval: ReturnType<typeof setInterval>;

function drawGlucose(glucose: Glucose) {
  // For mmol, round to tenth decimal.
  // For mgdl, leave as is as it's a whole number.
  const value = glucose.unit === "mmol"
    ? glucose[glucose.unit].toFixed(1)
    : glucose[glucose.unit];

  const glucoseNotLoadedElm = document.getElementById("GlucoseNotLoaded") as TextElement;
  glucoseNotLoadedElm.style.display = "none";

  const glucoseElm = new FitFont({
    id: "Glucose",
    font: "Bungee_Shade_110",
    halign: "middle",
    valign: "middle",
  });
  glucoseElm.text = value;

  const glucoseArrowIcon = document.getElementById("GlucoseArrowIcon") as ImageElement;
  glucoseArrowIcon.href = assetPathForTrend(glucose.trend);

  const glucoseLastUpdatedElm = document.getElementById("GlucoseLastUpdated") as TextElement;
  glucoseLastUpdatedElm.text = humanReadableLastUpdatedTimeSec(glucose.timestamp);

  // Handle artifical ticker. We can't get data reliably from the companion, so
  // instead we artifically create a ticker and reset it when new messages are
  // processed.
  let lastUpdatedTicker = glucose.timestamp;

  const tickUpdateCallback = () => {
    const stale = classifiedStale(lastUpdatedTicker);

    // Show line through glucose level to indicate stale
    const glucoseLineCrossElm = document.getElementById("GlucoseLine") as LineElement;
    if (stale) {
      glucoseLineCrossElm.style.display = "inline";
    } else {
      glucoseLineCrossElm.style.display = "none";
    }

    lastUpdatedTicker += 1;
    glucoseLastUpdatedElm.text = humanReadableLastUpdatedTimeSec(lastUpdatedTicker);
  };

  // Teardown ticker
  if (tickerInterval) {
    clearInterval(tickerInterval);
  }

  tickerInterval = setInterval(tickUpdateCallback, 1_000);
}

function drawDate() {
  const dateElm = document.getElementById("Date") as TextElement;
  dateElm.text = humanReadableDate();
}

function drawWeather(weather: Weather) {
  const weatherElm = document.getElementById("Weather") as TextElement;
  const DEGREE_HTML_CODE = "&#176;"

  weatherElm.text = weather.value + DEGREE_HTML_CODE + weather.unit.charAt(0);
}

function drawSteps() {
  const stepsElm = document.getElementById("Steps") as TextElement;
  steps((count: string) => stepsElm.text = count);
}

function drawHeartRate() {
  const hrElm = document.getElementById("HeartRate") as TextElement;
  hrm((hr: string) => hrElm.text = hr);
}

function drawClock() {
  const clockElm = document.getElementById("Clock") as TextElement;
  clock((time: string) => clockElm.text = time);
}

function drawAlert(glucose: Glucose) {
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

  const muteButtonElm = document.getElementById("MuteButton");
  // @ts-ignore
  muteButtonElm.onclick = () => {
    hideAlertDisplay();
    showMainDisplay();
  }
}

function triggerRefresh() {
  me.exit();
}

function processMessage(event: Message) {
  switch (event.type) {
    case "glucose":
      console.log("Processing glucose message")
      drawGlucose(event.message);
      drawAlert(event.message);
      break;
    case "weather":
      console.log("Processing weather message")
      drawWeather(event.message);
      break;
    case "refresh":
      console.log("Processing refresh message")
      triggerRefresh();
      break;
    default:
      throw new Error("Unhandled event type");
  }
}

(() => {
  drawDate();
  drawSteps();
  drawHeartRate();
  drawClock();

  asap.onmessage = processMessage;
})();
