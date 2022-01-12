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
    prevDismissed: boolean;
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

interface AlertDismissedMessage {
  type: "alert-dismissed";
  bg: number;
}

export type Message = GlucoseMessage | WeatherMessage | RefreshMessage | AlertDismissedMessage;
