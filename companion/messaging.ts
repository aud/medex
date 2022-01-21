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
import {outbox} from "file-transfer"
import {encode} from "cbor";

export async function sendData() {
  const data = [
    glucoseValues(),
    weatherValues(),
  ]

  try {
    console.error("Enqueueing file")
    await outbox.enqueue("new-data", encode(data))
  } catch(err) {
    console.error("failed to enqueue file: " + err);
  }
}

export function sendRefresh() {
  asap.cancel();
  asap.send({type: "refresh"});
}

function glucoseValues() {
  const values = getDexcomEstimatedGlucoseValues();
  if (Object.keys(values).length === 0) return;

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
      currentBg: values[unit],
    });

    alertActive = alert.active;
    alertType = alert.type;
  }

  const alertDismissed = getAlertDismissed();

  if (alertDismissed === true && alertActive === false) {
    setAlertDismissed("0");
  }

  return {
    type: "glucose",
    message: {
      unit,
      alert: {
        enabled: alertEnabled,
        active: alertActive,
        type: alertType,
        prevDismissed: alertDismissed,
      },
      ...values,
    }
  };
}

function weatherValues() {
  const weather = getWeatherValues();
  if (Object.keys(weather).length === 0) return;

  return {type: "weather", message: weather};
}
