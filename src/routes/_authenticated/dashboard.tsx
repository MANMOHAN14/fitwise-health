import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Footprints, Flame, HeartPulse, Moon, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { fitQuery, goalProgress, goalsQuery, METRICS, profileQuery, type MetricKey } from "@/lib/queries";
import { syncGoogleFit } from "@/lib/health.functions";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Pulse" }, { name: "description", content: "Your Google Fit health dashboard." }] }),
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(fitQuery),
      context.queryClient.ensureQueryData(profileQuery),
      context.queryClient.ensureQueryData(goalsQuery),
    ]),
  component: Dashboard,
});

export function useFitSync() {
  const qc = useQueryClient();
  const sync = useServerFn(syncGoogleFit);
  return useMutation({
    mutationFn: () => sync(),
    onSuccess: (r) => {
      toast.success(`Synced ${r.synced} days from Google Fit`);
      qc.invalidateQueries({ queryKey: ["fit"] });
      qc.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

function Stat({ icon: Icon, label, value, unit }: { icon: any; label: string; value: string | number; unit: string }) {
  return (
    <div className="rounded-2xl bg-card border p-5">
      <div className="flex items-center gap-2 text-sm text-muted-foreground"><Icon size={16} className="text-accent" />{label}</div>
      <div className="mt-2 font-display text-3xl font-semibold">{value}<span className="text-sm text-muted-foreground ml-1">{unit}</span></div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactElement }) {
  return (
    <div className="rounded-2xl bg-card border p-5">
      <h3 className="font-semibold mb-4">{title}</h3>
      <div className="h-56"><ResponsiveContainer>{children}</ResponsiveContainer></div>
    </div>
  );
}

function Dashboard() {
  const { data: fit } = useSuspenseQuery(fitQuery);
  const { data: profile } = useSuspenseQuery(profileQuery);
  const { data: goals } = useSuspenseQuery(goalsQuery);
  const sync = useFitSync();
  const today = fit.at(-1);
  const data = fit.slice(-14).map((r) => ({ ...r, label: r.day.slice(5) }));

  const action = (
    <div className="flex items-center gap-3">
      {profile?.last_sync && <span className="text-xs text-muted-foreground">Last sync {new Date(profile.last_sync).toLocaleString()}</span>}
      <Button onClick={() => sync.mutate()} disabled={sync.isPending}>
        <RefreshCw className={sync.isPending ? "animate-spin" : ""} />
        {profile?.fit_connected ? "Sync Google Fit" : "Connect Google Fit"}
      </Button>
    </div>
  );

  if (!fit.length) {
    return (
      <AppShell title={`Hi ${profile?.display_name ?? "there"}`} actions={action}>
        <div className="rounded-3xl bg-hero text-primary-foreground p-10 text-center">
          <h2 className="text-2xl font-semibold">Connect Google Fit to begin</h2>
          <p className="mt-2 opacity-90">We'll import your last 30 days of steps, heart rate, sleep and calories.</p>
          <Button variant="secondary" className="mt-6" onClick={() => sync.mutate()} disabled={sync.isPending}>
            {sync.isPending ? "Connecting…" : "Connect Google Fit"}
          </Button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title={`Hi ${profile?.display_name ?? "there"}`} actions={action}>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Stat icon={Footprints} label="Steps today" value={today!.steps.toLocaleString()} unit="" />
        <Stat icon={Flame} label="Calories" value={today!.calories} unit="kcal" />
        <Stat icon={HeartPulse} label="Resting HR" value={today!.heart_rate} unit="bpm" />
        <Stat icon={Moon} label="Sleep" value={today!.sleep_hours} unit="hrs" />
      </div>

      {goals.length > 0 && (
        <div className="rounded-2xl bg-card border p-5 mb-6">
          <div className="flex justify-between mb-3"><h3 className="font-semibold">Goal progress (7-day avg)</h3><Link to="/goals" className="text-sm text-primary">Manage</Link></div>
          <div className="space-y-3">
            {goals.map((g) => {
              const key = g.metric as MetricKey;
              const pct = goalProgress(fit.map((r) => Number(r[key])), Number(g.target));
              return (
                <div key={g.id}>
                  <div className="flex justify-between text-sm mb-1"><span>{METRICS[key]?.label ?? g.metric}</span><span>{pct}%</span></div>
                  <div className="h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary" style={{ width: `${pct}%` }} /></div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <ChartCard title="Steps (14 days)">
          <BarChart data={data}><CartesianGrid strokeDasharray="3 3" stroke="var(--border)" /><XAxis dataKey="label" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="steps" fill="var(--chart-1)" radius={[6, 6, 0, 0]} /></BarChart>
        </ChartCard>
        <ChartCard title="Sleep (hours)">
          <AreaChart data={data}><CartesianGrid strokeDasharray="3 3" stroke="var(--border)" /><XAxis dataKey="label" fontSize={11} /><YAxis fontSize={11} domain={[4, 10]} /><Tooltip /><Area dataKey="sleep_hours" stroke="var(--chart-3)" fill="var(--chart-3)" fillOpacity={0.25} /></AreaChart>
        </ChartCard>
        <ChartCard title="Resting heart rate">
          <LineChart data={data}><CartesianGrid strokeDasharray="3 3" stroke="var(--border)" /><XAxis dataKey="label" fontSize={11} /><YAxis fontSize={11} domain={["dataMin - 5", "dataMax + 5"]} /><Tooltip /><Line dataKey="heart_rate" stroke="var(--chart-2)" strokeWidth={2} dot={false} /></LineChart>
        </ChartCard>
        <ChartCard title="Calories burned">
          <AreaChart data={data}><CartesianGrid strokeDasharray="3 3" stroke="var(--border)" /><XAxis dataKey="label" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Area dataKey="calories" stroke="var(--chart-4)" fill="var(--chart-4)" fillOpacity={0.3} /></AreaChart>
        </ChartCard>
      </div>
    </AppShell>
  );
}
