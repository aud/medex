import asap from "fitbit-asap/companion";
import {
  getDexcomEstimatedGlucoseValues,
  getDexcomUnit,
  getWeatherValues,
} from "./local-storage";

export function sendData() {
  sendWeather();
  sendGlucose();
}

export function sendRefresh() {
  asap.send({type: "refresh"});
}

function sendGlucose() {
  const glucoseValues = getDexcomEstimatedGlucoseValues();
  if (Object.keys(glucoseValues).length === 0) return;

  asap.send({
    type: "glucose",
    message: {
      unit: getDexcomUnit(),
      ...glucoseValues,
    }
  });
}

function sendWeather() {
  const weather = getWeatherValues();
  if (Object.keys(weather).length === 0) return;

  asap.send({type: "weather", message: weather});
}
