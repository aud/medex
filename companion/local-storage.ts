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

export function getDexcomEstimatedGlucoseValues() {
  return deserializedContents(STORAGE_KEYS.DEXCOM_ESTIMATED_GLUCOSE_VALUES);
}

export function setDexcomEstimatedGlucoseValues(data: string) {
  return settingsStorage.setItem(STORAGE_KEYS.DEXCOM_ESTIMATED_GLUCOSE_VALUES, data);
}

export function getWeatherUnit() {
  return deserializedContents(STORAGE_KEYS.WEATHER_UNIT).values[0].name;
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
