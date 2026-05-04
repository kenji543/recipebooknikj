/**
 * Formats raw minutes into a readable string (e.g., 90 -> 1 hr 30 mins)
 * This acts as our "Custom Template Tag" equivalent.
 */
export function formatMinutes(minutes: number): string {
  if (!minutes || minutes <= 0) return "0 mins";
  
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  const hrStr = hrs > 0 ? `${hrs} hr${hrs > 1 ? "s" : ""}` : "";
  const minStr = mins > 0 ? `${mins} min${mins > 1 ? "s" : ""}` : "";
  
  return [hrStr, minStr].filter(Boolean).join(" ");
}

/**
 * Utility for Tailwind class merging (if needed)
 */
export function cn(...classes: (string | undefined | null | boolean)[]) {
  return classes.filter(Boolean).join(" ");
}
