import document from "document";
import type {Weather} from "../types/message";

export function drawWeather(weather: Weather) {
  const weatherElm = document.getElementById("Weather") as TextElement;
  const DEGREE_HTML_CODE = "&#176;"

  weatherElm.text = weather.value + DEGREE_HTML_CODE + weather.unit.charAt(0);
}
