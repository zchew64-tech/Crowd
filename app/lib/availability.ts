export type Tier = "hi" | "mid" | "lo";

export function getTier(percent: number): Tier {
  if (percent >= 75) return "hi";
  if (percent >= 45) return "mid";
  return "lo";
}

export function getLabel(percent: number) {
  if (percent >= 80) return "High chance";
  if (percent >= 50) return "Some seats";
  if (percent >= 20) return "Limited seating";
  return "Very unlikely";
}

export function getReportText(percent: number) {
  if (percent >= 80) return "plenty of seats";
  if (percent >= 50) return "some seats";
  if (percent >= 20) return "limited seating";
  return "no seats";
}

export function getAvailabilityText(percent: number) {
  if (percent >= 80) return "High chance of finding seating";
  if (percent >= 50) return "Some seats are available";
  if (percent >= 20) return "Limited seating available";
  return "Very unlikely to find seating";
}

export function timeAgo(milliseconds: number) {
  const seconds = milliseconds / 1000;
  if (seconds < 10) return "just now";
  if (seconds < 60) return `${Math.floor(seconds)} sec ago`;
  return `${Math.floor(seconds / 60)} min ago`;
}