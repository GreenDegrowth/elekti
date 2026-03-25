import { describe, expect, it } from "vitest";
import afJson from "../data/translations/af.json";
import enJson from "../data/translations/en.json";

function collectKeys(obj: Record<string, unknown>, prefix = ""): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const full = prefix ? `${prefix}.${key}` : key;
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      return collectKeys(value as Record<string, unknown>, full);
    }
    return [full];
  });
}

describe("Translation parity", () => {
  it("af.json contains every key from en.json", () => {
    const enKeys = new Set(collectKeys(enJson as Record<string, unknown>));
    const afKeys = new Set(collectKeys(afJson as Record<string, unknown>));
    const missing = [...enKeys].filter((k) => !afKeys.has(k));
    expect(missing).toEqual([]);
  });
});
