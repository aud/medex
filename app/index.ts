import document from "document";
import asap from "fitbit-asap/app";
import {humanReadableLastUpdatedTimeSec, humanReadableDate, assetPathForTrend} from "../common/utils";
import {hrm} from "./hrm";
import {steps} from "./steps";
import {clock} from "./clock";
import type {Glucose, Weather, Message} from "../types/message";

function drawGlucose(glucose: Glucose) {
  const glucoseElm = document.getElementById("Glucose") as TextElement;
  glucoseElm.text = (Math.round(glucose[glucose.unit] * 10) / 10).toString();

  // Show line through glucose level to indicate stale
  const glucoseLineCrossElm = document.getElementById("GlucoseLine") as LineElement;
  if (glucose.stale) {
    glucoseLineCrossElm.style.display = "inline";
  } else {
    glucoseLineCrossElm.style.display = "none";
  }

  const glucoseLastUpdatedElm = document.getElementById("GlucoseLastUpdated") as TextElement;
  glucoseLastUpdatedElm.text = humanReadableLastUpdatedTimeSec(glucose.timestamp);

  const glucoseArrowIcon = document.getElementById("GlucoseArrowIcon") as ImageElement;
  glucoseArrowIcon.href = assetPathForTrend(glucose.trend);
}

function drawDate() {
  const dateElm = document.getElementById("Date") as TextElement;
  dateElm.text = humanReadableDate();
}

function drawWeather(weather: Weather) {
  const weatherElm = document.getElementById("Weather") as TextElement;
  const DEGREE_HTML_CODE = "&#176;"

  weatherElm.text = `${weather.value}${DEGREE_HTML_CODE} ${weather.unit}`;
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

function processMessage(event: Message) {
  switch (event.type) {
    case "glucose":
      console.log("Processing glucose message")
      drawGlucose(event.message);
      break;
    case "weather":
      console.log("Processing weather message")
      drawWeather(event.message);
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
})()
