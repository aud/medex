import {peerSocket} from "messaging";
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

me.appTimeoutEnabled = false

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
})();

setInterval(() => {
  console.error("readystate: " + peerSocket.readyState)
}, 5_000);

// @ts-ignore
peerSocket.addEventListener("message", event => {
  console.error("HIT")
})

peerSocket.onopen = function() {
  console.error("Messaging open")
}

peerSocket.onclose = function(evt) {
  console.error(`Messaging closed: ${evt.code}`)
}

peerSocket.onerror = function(evt) {
  console.error(`Messaging error: ${evt.code}: ${evt.message}`)
}
