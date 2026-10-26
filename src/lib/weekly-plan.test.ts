import { describe, expect, it } from "vitest";
import { parseWeeklyPlan } from "./weekly-plan";

describe("weekly plan items", () => {
  it("makes each workout and individual meal independently checkable", () => {
    const plan = parseWeeklyPlan("Summary\n### Monday\n**Workout**: Walk 30 minutes\n**Meals**\n- **Breakfast**: Oats\n- **Lunch**: Salad\n- **Dinner**: Soup\n- **Snack**: Apple\nRecovery/sleep tip: Rest well.");
    expect(plan.days[0].items.map((item) => item.category)).toEqual(["workout", "breakfast", "lunch", "dinner", "snack"]);
    expect(new Set(plan.days[0].items.map((item) => item.id)).size).toBe(5);
    expect(plan.days[0].items[0].content).toBe("Walk 30 minutes");
    expect(plan.days[0].notes).toContain("Rest well.");
  });
  it("separates meals on the same line and isolates progress by day", () => {
    const plan = parseWeeklyPlan("### Monday\n**Breakfast:** Oats **Lunch:** Salad\n### Tuesday\n**Breakfast:** Toast");
    expect(plan.days[0].items.map((item) => item.content)).toEqual(["Oats", "Salad"]);
    expect(plan.days[0].items[0].id).not.toBe(plan.days[1].items[0].id);
  });
});