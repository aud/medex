import {settingsStorage} from "settings";
import {STORAGE_KEYS} from "../common/config";

export function getDexcomUsername() {
  return deserializedContents(STORAGE_KEYS.DEXCOM_USERNAME).name;
}

export function getDexcomPassword() {
  return deserializedContents(STORAGE_KEYS.DEXCOM_PASSWORD).name;
}

export function getDexcomServer(): "us" | "eu" {
  const data = deserializedContents(STORAGE_KEYS.DEXCOM_SERVER).values;

  return data && data[0].name;
}

export function getDexcomUnit() {
  const data = deserializedContents(STORAGE_KEYS.DEXCOM_UNIT).values;

  return data && data[0].name;
}

export function getHighAlertThreshold() {
  return deserializedContents(STORAGE_KEYS.DEXCOM_HIGH_THRESHOLD).name;
}

export function getLowAlertThreshold() {
  return deserializedContents(STORAGE_KEYS.DEXCOM_LOW_THRESHOLD).name;
}

export function getDexcomEstimatedGlucoseValues() {
  return deserializedContents(STORAGE_KEYS.DEXCOM_ESTIMATED_GLUCOSE_VALUES);
}

export function setAlertDismissed(data: string) {
  return settingsStorage.setItem(STORAGE_KEYS.DEXCOM_ALERT_DISMISSED, data);
}

export function getAlertDismissed() {
  const data = deserializedContents(STORAGE_KEYS.DEXCOM_ALERT_DISMISSED);
  return data === 1;
}

export function setDexcomEstimatedGlucoseValues(data: string) {
  return settingsStorage.setItem(STORAGE_KEYS.DEXCOM_ESTIMATED_GLUCOSE_VALUES, data);
}

export function getWeatherUnit() {
  const data = deserializedContents(STORAGE_KEYS.WEATHER_UNIT).values;

  return data && data[0].name;
}

export function getWeatherValues() {
  return deserializedContents(STORAGE_KEYS.WEATHER_VALUES);
}

export function setWeatherValues(data: string) {
  return settingsStorage.setItem(STORAGE_KEYS.WEATHER_VALUES, data);
}

function deserializedContents(key: string) {
  return JSON.parse(settingsStorage.getItem(key) || "{}");
}
