export function getWeekNumber(d: Date) {
  // Copy date so don't modify original
  const clone = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  clone.setUTCDate(clone.getUTCDate() + 4 - (clone.getUTCDay() || 7));
  // Get first day of year
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  // Calculate full weeks to nearest Thursday
  const weekNo = Math.ceil(
    ((clone.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
  );
  // Return array of year and week number
  return [d.getUTCFullYear(), weekNo] as const;
}
