import { AXIS_COLOR_THRESHOLDS } from "./constants";

export function formatPercentage(score: number): string {
  return Math.max(0, score * 100).toFixed(1);
}

function toLinear(c: number): number {
  return c <= 0.040_45 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

export function isLightColour(hex: string): boolean {
  const r = Number.parseInt(hex.slice(1, 3), 16) / 255;
  const g = Number.parseInt(hex.slice(3, 5), 16) / 255;
  const b = Number.parseInt(hex.slice(5, 7), 16) / 255;
  const L = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  return L > 0.179;
}

export function badgeTextColor(hex: string): string {
  return isLightColour(hex) ? "#1a1a1a" : "white";
}

export function getAxisColor(percentage: number): string {
  if (percentage >= AXIS_COLOR_THRESHOLDS.STRONG.percentage) {
    return AXIS_COLOR_THRESHOLDS.STRONG.color;
  }
  if (percentage >= AXIS_COLOR_THRESHOLDS.MODERATE.percentage) {
    return AXIS_COLOR_THRESHOLDS.MODERATE.color;
  }
  if (percentage >= AXIS_COLOR_THRESHOLDS.WEAK.percentage) {
    return AXIS_COLOR_THRESHOLDS.WEAK.color;
  }
  return AXIS_COLOR_THRESHOLDS.NONE.color;
}
