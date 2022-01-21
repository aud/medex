import {me} from "appbit";
import {drawGlucose} from "./glucose";
import {drawDate} from "./date";
import {drawSteps} from "./steps";
import {drawWeather} from "./weather";
import {drawClock} from "./clock";
import {drawHeartRate} from "./hrm";
import {drawAlert} from "./alert";
import type {Message} from "../types/message";
import {inbox} from "file-transfer"
import {readFileSync, unlinkSync, listDirSync} from "fs";

me.appTimeoutEnabled = false;

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

function processAllFiles() {
  let fileName: string | undefined;
  while (fileName = inbox.nextFile()) {
    console.log(`/private/data/${fileName} is now available`);

    // @ts-ignore
    const messages = readFileSync(fileName, "cbor") as Message[];
    messages.forEach(msg => processMessage(msg))

    unlinkSync(fileName)
  }
}

(() => {
  drawDate();
  drawSteps();
  drawHeartRate();
  drawClock();

  // @ts-ignore
  inbox.addEventListener("newfile", processAllFiles);
  processAllFiles();
})();
