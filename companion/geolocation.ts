import {geolocation, PositionError} from "geolocation";

interface Coords {
  latitude: number;
  longitude: number;
}

export async function coordinates(): Promise<Coords> {
  return new Promise((resolve, reject) => {
    const successHandler = (position: Position) => {
      const {coords: {latitude, longitude}} = position;
      resolve({latitude, longitude});
    }

    const errorHandler = (error: PositionError) => reject(error);

    geolocation.getCurrentPosition(successHandler, errorHandler, {
      timeout: 60 * 1000
    });
  });
}
