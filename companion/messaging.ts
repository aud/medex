import asap from "fitbit-asap/companion";
import {
  getDexcomEstimatedGlucoseValues,
  getDexcomUnit,
  getWeatherValues,
  getHighAlertThreshold,
  getLowAlertThreshold,
  getAlertDismissed,
  setAlertDismissed,
} from "./local-storage";
import {Alert} from "./alert";

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

  const unit = getDexcomUnit();

  // TODO: Extract alerting
  const lowAlertThreshold = parseFloat(getLowAlertThreshold());
  const highAlertThreshold = parseFloat(getHighAlertThreshold());

  const alertEnabled =
    !Object.is(NaN, lowAlertThreshold)
    && !Object.is(NaN, highAlertThreshold);

  let alertActive = false;
  let alertType = null;

  if (alertEnabled) {
    const alert = new Alert({
      lowAlertThreshold,
      highAlertThreshold,
      currentBg: glucoseValues[unit],
    });

    alertActive = alert.active;
    alertType = alert.type;
  }

  const alertDismissed = getAlertDismissed();

  if (alertDismissed === true && alertActive === false) {
    setAlertDismissed("0");
  }

  asap.send({
    type: "glucose",
    message: {
      unit,
      alert: {
        enabled: alertEnabled,
        active: alertActive,
        type: alertType,
        prevDismissed: alertDismissed,
      },
      ...glucoseValues,
    }
  });
}

function sendWeather() {
  const weather = getWeatherValues();
  if (Object.keys(weather).length === 0) return;

  asap.send({type: "weather", message: weather});
}
