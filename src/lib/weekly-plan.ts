export type PlanCategory = "workout" | "breakfast" | "lunch" | "dinner" | "snack";
export type PlanItem = { id: string; category: PlanCategory; content: string };
export type PlanDay = { name: string; items: PlanItem[]; notes: string };
export type ParsedPlan = { intro: string; days: PlanDay[] };

const dayHeading = /^#{1,6}\s+\*{0,2}((?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\b[^\n]*)/i;
const categoryLabel = /(?:^|\s)(?:[-*+]\s+)?(?:\*\*)?(Workout|Breakfast|Lunch|Dinner|Snack)(?:\*\*)?\s*:(?:\*\*)?\s*/gi;

/** Keep the original advice while turning labelled activities into checkable items. */
export function parseWeeklyPlan(content: string): ParsedPlan {
  const intro: string[] = [];
  const days: PlanDay[] = [];
  let current: PlanDay | undefined;
  for (const line of content.split("\n")) {
    const heading = line.match(dayHeading);
    if (heading?.[1]) {
      current = { name: heading[1].replace(/\*\*/g, "").trim(), items: [], notes: "" };
      days.push(current);
      continue;
    }
    if (!current) { intro.push(line); continue; }
    const labels = [...line.matchAll(categoryLabel)];
    if (labels.length) {
      labels.forEach((match, index) => {
        if (!match[1]) return;
        const category = match[1].toLowerCase() as PlanCategory;
        const start = (match.index ?? 0) + match[0].length;
        const text = line.slice(start, labels[index + 1]?.index ?? line.length).trim();
        current?.items.push({ id: `${days.length - 1}-${category}-${current.items.length}`, category, content: text });
      });
    } else if (!/^\s*(?:#{1,6}\s*)?(?:\*\*)?Meals(?:\*\*)?\s*:?\s*$/i.test(line)) {
      current.notes += `${line}\n`;
    }
  }
  return { intro: intro.join("\n").trim(), days };
}

export const WELLNESS_TIPS = [
  "Start small today. A little movement still counts toward a stronger you.",
  "Pause for a few slow breaths and let your shoulders relax.",
  "Notice how you feel, not just what you finish. Rest is part of progress.",
  "Make time for a meal without distractions and enjoy each bite.",
  "Celebrate one small win from your week—you earned it.",
  "Spend a little time outside today, at a pace that feels good to you.",
  "Give yourself permission to recharge. Tomorrow is a fresh start.",
];