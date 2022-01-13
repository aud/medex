import document from "document";
import {humanReadableDate} from "../common/utils";

export function drawDate() {
  const dateElm = document.getElementById("Date") as TextElement;
  dateElm.text = humanReadableDate();
}
