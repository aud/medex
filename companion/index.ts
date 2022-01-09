import asap from "fitbit-asap/companion";
import {DexcomClient} from "dexcom-share-api";
import {settingsStorage} from "settings";
import {STORAGE_KEYS} from "../common/config";
import {
  getDexcomUsername,
  getDexcomPassword,
  getDexcomServer,
} from "./local-storage";
import {writeGlucose} from "./glucose";
import {writeWeather} from "./weather";
import {sendGlucose, sendWeather, sendRefresh} from "./messaging";

function refreshClient() {
  try {
    return new DexcomClient({
      username: getDexcomUsername(),
      password: getDexcomPassword(),
      server: getDexcomServer(),
    });

    // If config is immediately incorrect
  } catch(err) {
    console.error(`DexcomClient: ${(err as Error)}`);

    return undefined;
  }
};

let client = refreshClient();

settingsStorage.onchange = (event: StorageChangeEvent) => {
  switch (event.key) {
    case STORAGE_KEYS.DEXCOM_USERNAME:
    case STORAGE_KEYS.DEXCOM_PASSWORD:
    case STORAGE_KEYS.DEXCOM_SERVER:
      client = refreshClient();
      break;
  }

  sendRefresh();
}

(async () => {
  // Cancel if previous messages
  asap.cancel();

  // Warm store on initialization
  await writeWeather();
  await writeGlucose(client);

  // Paint UI on initilization
  sendWeather();
  sendGlucose();

  // Refresh weather store every 15s
  setInterval(async () => await writeWeather(), 15_000);

  // Refresh glucose store every 15s
  setInterval(async () => await writeGlucose(client), 15_000);

  // Repaint glucose data every 1s
  setInterval(sendGlucose, 1_000);

  // Repaint weather data every 30s
  setInterval(sendWeather, 30_000);
})();
