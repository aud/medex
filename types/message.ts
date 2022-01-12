export interface Glucose {
  mmol: number;
  mgdl: number;
  trend: string;
  timestamp: number;
  unit: string;
  alert: {
    type: "high" | "low" | undefined;
    active: boolean;
    enabled: boolean;
  }
}

export interface Weather {
  value: string;
  unit: "celcius" | "fahrenheit";
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
