import document from "document";
import {FitFont} from "fitfont";
import {
  humanReadableLastUpdatedTimeSec,
  assetPathForTrend,
  classifiedStale,
} from "../common/utils";
import type {Glucose} from "../types/message";

let tickerInterval: ReturnType<typeof setInterval>;

export function drawGlucose(glucose: Glucose) {
  // For mmol, round to tenth decimal.
  // For mgdl, leave as is as it's a whole number.
  const value = glucose.unit === "mmol"
    ? glucose[glucose.unit].toFixed(1)
    : glucose[glucose.unit];

  const glucoseNotLoadedElm = document.getElementById("GlucoseNotLoaded") as TextElement;
  glucoseNotLoadedElm.style.display = "none";

  const glucoseElm = new FitFont({
    id: "Glucose",
    font: "Bungee_Shade_90",
    halign: "middle",
    valign: "middle",
  });
  glucoseElm.text = value;

  const glucoseArrowIcon = document.getElementById("GlucoseArrowIcon") as ImageElement;
  glucoseArrowIcon.href = assetPathForTrend(glucose.trend);

  const glucoseLastUpdatedElm = document.getElementById("GlucoseLastUpdated") as TextElement;
  glucoseLastUpdatedElm.text = humanReadableLastUpdatedTimeSec(glucose.timestamp);

  // Handle artifical ticker. We can't get data reliably from the companion, so
  // instead we artifically create a ticker and reset it when new messages are
  // processed.
  let lastUpdatedTicker = glucose.timestamp;

  const tickUpdateCallback = () => {
    const stale = classifiedStale(lastUpdatedTicker);

    // Show line through glucose level to indicate stale
    const glucoseLineCrossElm = document.getElementById("GlucoseLine") as LineElement;
    if (stale) {
      glucoseLineCrossElm.style.display = "inline";
    } else {
      glucoseLineCrossElm.style.display = "none";
    }

    lastUpdatedTicker += 1;
    glucoseLastUpdatedElm.text = humanReadableLastUpdatedTimeSec(lastUpdatedTicker);
  };

  // Teardown ticker
  if (tickerInterval) {
    clearInterval(tickerInterval);
  }

  tickerInterval = setInterval(tickUpdateCallback, 1_000);
}
