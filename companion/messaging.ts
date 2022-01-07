import asap from "fitbit-asap/companion";
import {
  getDexcomEstimatedGlucoseValues,
  getDexcomUnit,
  getWeatherValues,
} from "./local-storage";
import {classifiedStale} from "./glucose";

export function sendGlucose() {
  const glucoseValues = getDexcomEstimatedGlucoseValues();

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
  asap.send({
    type: "weather",
    message: {
      ...getWeatherValues(),
    }
  });
}
