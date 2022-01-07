import {DexcomClient} from "dexcom-share-api";
import {setDexcomEstimatedGlucoseValues} from "./local-storage";
import {Glucose} from "../types/message";

export async function writeGlucose(client: DexcomClient | undefined) {
  try {
    if (typeof client === "undefined") {
      throw new Error("Client misconfigured");
    }

    const data = await client.getEstimatedGlucoseValues();

    setDexcomEstimatedGlucoseValues(JSON.stringify(data[0]));

    return true
  } catch(err) {
    console.error((err as Error).toString());

    return undefined;
  }
};

export function classifiedStale(timestamp: Glucose["timestamp"]) {
  const now = new Date().getTime();

  // Usually a refresh will happen every 5m. Past 10m and the data will be
  // considered stale.
  const staleThreshold = 10 * 60;

  return now >= (timestamp + staleThreshold * 1000);
}
