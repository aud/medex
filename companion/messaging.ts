import {peerSocket} from "messaging";
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
  console.log("Sending refresh")

  if (peerSocket.readyState === peerSocket.OPEN) {
    peerSocket.send({type: "refresh"});
  } else {
    console.error("Refresh: Peer socket closed!")
  }
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

  if (peerSocket.readyState === peerSocket.OPEN) {
    console.error("Glucose: Sending!")
    peerSocket.send({
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
  } else {
    console.error("Glucose: Peer socket not open!")
  }
}

function sendWeather() {
  const weather = getWeatherValues();
  if (Object.keys(weather).length === 0) return;

  if (peerSocket.readyState === peerSocket.OPEN) {
    console.error("Weather: Sending!")
    peerSocket.send({type: "weather", message: weather});
  } else {
    console.error("Weather: Peer socket not open!")
  }
}
