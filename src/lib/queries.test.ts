import { describe, expect, it } from "vitest";
import { goalProgress } from "./queries";
import { simulateFit } from "./simulate";

describe("goalProgress", () => {
  it("uses the last 7 days average", () => {
    expect(goalProgress([0, 0, 5000, 5000, 5000, 5000, 5000, 5000, 5000], 10000)).toBe(50);
  });
  it("caps at 100", () => {
    expect(goalProgress([20000], 10000)).toBe(100);
  });
});

describe("simulated Google Fit sync", () => {
  it("returns one row per day and is deterministic", () => {
    const d = new Date("2026-10-26T00:00:00Z");
    const a = simulateFit("u1", 30, 72, d);
    expect(a).toHaveLength(30);
    expect(a.at(-1)?.day).toBe("2026-10-26");
    expect(simulateFit("u1", 30, 72, d)).toEqual(a);
  });
});
