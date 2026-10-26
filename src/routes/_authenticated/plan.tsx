import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import ReactMarkdown from "react-markdown";
import { Sparkle } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { planQuery } from "@/lib/queries";
import { generateWeeklyPlan } from "@/lib/health.functions";

export const Route = createFileRoute("/_authenticated/plan")({
  head: () => ({ meta: [{ title: "Weekly Plan — Pulse" }, { name: "description", content: "Your AI-generated workout and meal plan." }] }),
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
        <div className="rounded-3xl bg-card border p-6 md:p-8">
          <p className="text-xs text-muted-foreground mb-2">Created {new Date(plan.created_at).toLocaleString()}</p>
          <div className="prose-coach"><ReactMarkdown>{plan.content}</ReactMarkdown></div>
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
