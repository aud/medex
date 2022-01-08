export function humanReadableLastUpdatedTimeSec(timestamp: number) {
  const seconds = Math.round(
    (new Date().getTime() - new Date(timestamp).getTime()) / 1000,
  )

  if (seconds >= 60) {
    const mins = Math.floor(seconds % 3600 / 60);
    const secs = Math.floor(seconds % 60);

    return `${mins}m ${secs}s`;
  }

  const secs = Math.floor(seconds % 60);
  return `${secs}s`;
}

export function assetPathForTrend(trend: string) {
  return "images/" + trend + ".png";
}

export function kelvinToCelcius(kelvin: number) {
  return kelvin - 273.15;
}

export function kelvinToFahrenheit(kelvin: number) {
  return ((kelvin - 273.15) * 1.8) + 32;
}

// Returns the current date in the format of (eg. Wed. 8)
export function humanReadableDate() {
  const DAYS = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ];

  const today = new Date();

  const dayOfWeek  = today.getDay();
  const dayOfMonth = today.getDate();

  return DAYS[dayOfWeek] + ". " + dayOfMonth;
}
