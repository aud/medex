import {
  getOpenWeatherMapApiKey,
  getWeatherUnit,
  setWeatherValues,
} from "./local-storage";
import {coordinates} from "./geolocation";
import {kelvinToFahrenheit, kelvinToCelcius} from "../common/utils";

export async function writeWeather() {
  try {
    const apiKey = getOpenWeatherMapApiKey();

    if (!apiKey) throw new Error("API key not configured");

    const {latitude, longitude} = await coordinates();

    const result = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`,
    );

    const json = await result.json();

    if (result.status !== 200) {
      throw new Error(`Openweathermap responded with ${result.status}`);
    }

    const temp = json.main.temp;
    const unit = getWeatherUnit();

    const temperature = unit === "c"
      ? kelvinToCelcius(temp)
      : kelvinToFahrenheit(temp);

    setWeatherValues(
      JSON.stringify({
        value: Math.round(temperature).toString(),
        unit,
      })
    );

    return true;
  } catch (err) {
    console.error(`Weather: ${(err as Error)}`);
  }
}
