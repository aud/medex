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
import {sendData, sendRefresh} from "./messaging";
import {me} from "companion";

// 5m is the lowest possible time for wakeup.
// https://dev.fitbit.com/build/guides/companion/#periodic-wake-interval
//
// Note: The companion lifecycle is _very_ unpredictable. It may be inactive
// for a number of reasons (eg. phone battery), fitbit sdk bugs..
me.wakeInterval = 5 * 60 * 1000;

// @ts-ignore
me.onwakeinterval = async () => {
  console.log("Hit wake interval")

  await writeWeather();
  await writeGlucose(client);

  sendData();
}

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
  sendData();
}

(async () => {
  // Cancel if previous messages
  asap.cancel();

  // Warm store on initialization
  await writeWeather();
  await writeGlucose(client);

  // Paint UI on initilization
  sendData();

  // Refresh weather store every 5m
  setInterval(async () => await writeWeather(), 5 * 60 * 1000);
  // Refresh glucose store every 30s
  setInterval(async () => await writeGlucose(client), 30 * 1000);

  // Repaint UI with latest data every 30s
  setInterval(sendData, 30 * 1000);
})();
