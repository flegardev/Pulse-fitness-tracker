/**
 * Formats weight with unit
 */
export function formatWeight(kg: number, unit: "kg" | "lbs" = "kg"): string {
  if (unit === "lbs") {
    const lbs = kg * 2.20462;
    return `${lbs.toFixed(1)} lbs`;
  }
  return `${kg.toFixed(1)} kg`;
}

/**
 * Formats duration in minutes and seconds
 */
export function formatWorkoutDuration(durationSeconds: number): string {
  const mins = Math.floor(durationSeconds / 60);
  const secs = durationSeconds % 60;
  if (mins > 60) {
    const hrs = Math.floor(mins / 60);
    const remMins = mins % 60;
    return `${hrs}h ${remMins}m`;
  }
  return `${mins}m ${secs}s`;
}
