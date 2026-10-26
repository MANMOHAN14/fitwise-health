import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Apple, Bike, Coffee, Dumbbell, Footprints, Heart, Salad, Soup, Waves, type LucideIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { parseWeeklyPlan, WELLNESS_TIPS, type PlanItem } from "@/lib/weekly-plan";

const labels = { workout: "Workout", breakfast: "Breakfast", lunch: "Lunch", dinner: "Dinner", snack: "Snack" };

function itemIcon(item: PlanItem): LucideIcon {
  if (item.category === "breakfast") return Coffee;
  if (item.category === "lunch") return Salad;
  if (item.category === "dinner") return Soup;
  if (item.category === "snack") return Apple;
  if (/strength|squat|push-up|resistance/i.test(item.content)) return Dumbbell;
  if (/swim/i.test(item.content)) return Waves;
  if (/cycl|bike/i.test(item.content)) return Bike;
  return Footprints;
}

export function WeeklyPlanChecklist({ plan }: { plan: { id: string; user_id: string; content: string } }) {
  const parsed = useMemo(() => parseWeeklyPlan(plan.content), [plan.content]);
  const storageKey = `pulse:plan-progress:${plan.user_id}:${plan.id}`;
  const [completed, setCompleted] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [saveError, setSaveError] = useState(false);
  useEffect(() => {
    try {
      const saved: unknown = JSON.parse(localStorage.getItem(storageKey) ?? "[]");
      setCompleted(Array.isArray(saved) ? saved.filter((id): id is string => typeof id === "string") : []);
    } catch { setCompleted([]); }
    setReady(true);
  }, [storageKey]);

  function toggle(id: string, checked: boolean) {
    const next = checked ? [...new Set([...completed, id])] : completed.filter((item) => item !== id);
    setCompleted(next);
    try { localStorage.setItem(storageKey, JSON.stringify(next)); setSaveError(false); }
    catch { setSaveError(true); }
  }

  if (!parsed.days.length) return <div className="prose-coach"><ReactMarkdown>{plan.content}</ReactMarkdown></div>;

  return (
    <div className="space-y-6">
      {parsed.intro && <div className="prose-coach text-muted-foreground"><ReactMarkdown>{parsed.intro}</ReactMarkdown></div>}
      {saveError && <p role="alert" className="text-sm text-destructive">Progress couldn’t be saved on this device. Your checkmarks will reset when you leave.</p>}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 items-start">
        {parsed.days.map((day, index) => {
          const count = day.items.filter((item) => completed.includes(item.id)).length;
          return (
            <section key={day.name} className="rounded-lg border bg-card overflow-hidden min-w-0" aria-label={`${day.name} plan`}>
              <header className="flex flex-wrap items-center justify-between gap-2 border-b bg-secondary/40 px-5 py-4">
                <h2 className="text-lg font-semibold">{day.name}</h2>
                <span className="text-xs font-medium text-muted-foreground" aria-live="polite">{count} / {day.items.length} completed</span>
              </header>
              <div className="divide-y divide-border px-5">
                {day.items.map((item) => {
                  const checked = completed.includes(item.id);
                  const Icon = itemIcon(item);
                  const id = `plan-${plan.id}-${item.id}`;
                  return (
                    <div key={item.id} className="flex items-start gap-3 py-4">
                      <Checkbox id={id} checked={checked} disabled={!ready} onCheckedChange={(value) => toggle(item.id, value === true)} aria-label={`${day.name} ${labels[item.category]}`} className="mt-1 h-5 w-5" />
                      <div className="min-w-0 flex-1">
                        <label htmlFor={id} className="flex items-center gap-2 font-semibold text-sm cursor-pointer"><Icon size={17} aria-hidden="true" className={item.category === "workout" ? "text-primary" : "text-accent"} />{labels[item.category]}</label>
                        <div className={cn("prose-coach text-sm leading-relaxed break-words", checked && "text-muted-foreground line-through decoration-border")}><ReactMarkdown>{item.content}</ReactMarkdown></div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="px-5 pb-5 space-y-3">
                {day.notes.trim() && <div className="prose-coach text-sm text-muted-foreground break-words"><ReactMarkdown>{day.notes}</ReactMarkdown></div>}
                <div className="border-t pt-4 flex gap-2 text-sm text-primary"><Heart size={17} className="shrink-0 mt-0.5" aria-hidden="true" /><p><span className="font-semibold">A little encouragement</span><br />{WELLNESS_TIPS[index % WELLNESS_TIPS.length]}</p></div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}