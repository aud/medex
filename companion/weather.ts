import {getWeatherUnit, setWeatherValues} from "./local-storage";
import weather from "weather";

export async function writeWeather() {
  try {
    const unit = getWeatherUnit() || "celsius";

    const data = await weather.getWeatherData({temperatureUnit: unit})
    const temperature = data.locations[0].currentWeather.temperature;

    setWeatherValues(
      JSON.stringify({
        value: Math.round(temperature).toString(),
        unit,
      })
    );

    return true;
  } catch(err) {
    console.error(`Weather: ${(err as Error)}`);
  }
}
