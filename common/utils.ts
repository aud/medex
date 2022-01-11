import {Glucose} from "../types/message";

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

export function classifiedStale(timestamp: Glucose["timestamp"]) {
  const now = new Date().getTime();

  // Usually a refresh will happen every 5m. Past 10m and the data will be
  // considered stale.
  const staleThreshold = 10 * 60;

  return now >= (timestamp + staleThreshold * 1000);
}
