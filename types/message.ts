export interface Glucose {
  mmol: number;
  mgdl: number;
  trend: string;
  timestamp: number;
  unit: string;
  stale: boolean;
}

export interface Weather {
  value: string;
  unit: "C" | "F";
}

interface GlucoseMessage {
  type: "glucose";
  message: Glucose;
}

interface WeatherMessage {
  type: "weather";
  message: Weather;
}

interface RefreshMessage {
  type: "refresh";
}

export type Message = GlucoseMessage | WeatherMessage | RefreshMessage;
