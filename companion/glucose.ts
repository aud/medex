import {DexcomClient} from "dexcom-share-api";
import {setDexcomEstimatedGlucoseValues} from "./local-storage";

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
