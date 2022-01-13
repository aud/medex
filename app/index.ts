import {me} from "appbit";
import asap from "fitbit-asap/app";
import {drawGlucose} from "./glucose";
import {drawDate} from "./date";
import {drawSteps} from "./steps";
import {drawWeather} from "./weather";
import {drawClock} from "./clock";
import {drawHeartRate} from "./hrm";
import {drawAlert} from "./alert";
import type {Message} from "../types/message";

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
