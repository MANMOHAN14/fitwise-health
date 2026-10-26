import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fitQuery, goalProgress, goalsQuery, METRICS, type MetricKey } from "@/lib/queries";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/goals")({
  head: () => ({ meta: [{ title: "Goals — Pulse" }, { name: "description", content: "Set and track your health goals." }, { property: "og:title", content: "Goals — Pulse" }, { property: "og:description", content: "Track your progress toward personal activity and sleep goals." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  loader: ({ context }) => Promise.all([context.queryClient.ensureQueryData(goalsQuery), context.queryClient.ensureQueryData(fitQuery)]),
  component: Goals,
});

function Goals() {
  const { data: goals } = useSuspenseQuery(goalsQuery);
  const { data: fit } = useSuspenseQuery(fitQuery);
  const qc = useQueryClient();
  const [metric, setMetric] = useState<MetricKey>("steps");
  const [target, setTarget] = useState("10000");

  async function add(e: React.FormEvent) {
    e.preventDefault();
    const { data: u } = await supabase.auth.getUser();
    const { error } = await supabase.from("goals").insert({ user_id: u.user!.id, metric, target: Number(target) });
    if (error) { toast.error(error.message); return; }
    toast.success("Goal added");
    qc.invalidateQueries({ queryKey: ["goals"] });
  }
  async function remove(id: string) {
    const { error } = await supabase.from("goals").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    qc.invalidateQueries({ queryKey: ["goals"] });
  }

  return (
    <AppShell title="Goals">
      <form onSubmit={add} className="rounded-2xl bg-card border p-5 flex flex-wrap gap-3 items-end mb-6">
        <div className="min-w-48">
          <label className="text-sm text-muted-foreground">Metric</label>
          <Select value={metric} onValueChange={(v) => setMetric(v as MetricKey)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{Object.entries(METRICS).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm text-muted-foreground">Daily target ({METRICS[metric].unit})</label>
          <Input type="number" min={0.1} step="any" value={target} onChange={(e) => setTarget(e.target.value)} required />
        </div>
        <Button type="submit">Add goal</Button>
      </form>
      <div className="grid md:grid-cols-2 gap-4">
        {goals.length === 0 && <p className="text-muted-foreground">No goals yet. Add one above.</p>}
        {goals.map((g) => {
          const key = g.metric as MetricKey;
          const pct = goalProgress(fit.map((r) => Number(r[key])), Number(g.target));
          return (
            <div key={g.id} className="rounded-2xl bg-card border p-5">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{METRICS[key]?.label}</h3>
                  <p className="text-sm text-muted-foreground">Target {Number(g.target).toLocaleString()} {METRICS[key]?.unit}/day</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => remove(g.id)} aria-label="Delete goal"><Trash2 /></Button>
              </div>
              <div className="font-display text-4xl font-semibold mt-3 text-primary">{pct}%</div>
              <div className="h-2 rounded-full bg-muted mt-2"><div className="h-2 rounded-full bg-accent" style={{ width: `${pct}%` }} /></div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
