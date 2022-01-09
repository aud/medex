import asap from "fitbit-asap/companion";
import {
  getDexcomEstimatedGlucoseValues,
  getDexcomUnit,
  getWeatherValues,
} from "./local-storage";
import {classifiedStale} from "./glucose";

export function sendGlucose() {
  const glucoseValues = getDexcomEstimatedGlucoseValues();
  if (Object.keys(glucoseValues).length === 0) return;

  asap.send({
    type: "glucose",
    message: {
      unit: getDexcomUnit(),
      stale: classifiedStale(glucoseValues.timestamp),
      ...glucoseValues,
    }
  });
}

export function sendWeather() {
  const weather = getWeatherValues();
  if (Object.keys(weather).length === 0) return;

  asap.send({type: "weather", message: weather});
}

export function sendRefresh() {
  asap.send({type: "refresh"});
}
