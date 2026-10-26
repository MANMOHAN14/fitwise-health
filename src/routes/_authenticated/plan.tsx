import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Sparkle } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { planQuery } from "@/lib/queries";
import { generateWeeklyPlan } from "@/lib/health.functions";
import { WeeklyPlanChecklist } from "@/components/WeeklyPlanChecklist";

export const Route = createFileRoute("/_authenticated/plan")({
  head: () => ({ meta: [{ title: "Weekly Plan — Pulse" }, { name: "description", content: "Your personal workout and meal plan with daily progress and wellness encouragement." }, { property: "og:title", content: "Weekly Plan — Pulse" }, { property: "og:description", content: "Check off meals and workouts and find daily encouragement in your personal weekly plan." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(planQuery),
  component: Plan,
});

function Plan() {
  const { data: plan } = useSuspenseQuery(planQuery);
  const qc = useQueryClient();
  const gen = useServerFn(generateWeeklyPlan);
  const m = useMutation({
    mutationFn: () => gen(),
    onSuccess: () => { toast.success("New plan ready"); qc.invalidateQueries({ queryKey: ["plan"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <AppShell
      title="Weekly Plan"
      actions={<Button onClick={() => m.mutate()} disabled={m.isPending}><Sparkle />{m.isPending ? "Generating… (≈30s)" : plan ? "Regenerate plan" : "Generate my plan"}</Button>}
    >
      {plan ? (
        <div>
          <p className="text-xs text-muted-foreground mb-2">Created {new Date(plan.created_at).toLocaleString()}</p>
          <WeeklyPlanChecklist key={plan.id} plan={plan} />
        </div>
      ) : (
        <div className="rounded-3xl bg-hero text-primary-foreground p-10 text-center">
          <h2 className="text-2xl font-semibold">No plan yet</h2>
          <p className="opacity-90 mt-2">Sync Google Fit and set goals first for the best plan, then generate.</p>
        </div>
      )}
    </AppShell>
  );
}
