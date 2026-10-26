import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { profileQuery } from "@/lib/queries";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({ meta: [{ title: "Profile — Pulse" }, { name: "description", content: "Your health profile." }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(profileQuery),
  component: Profile,
});

function Profile() {
  const { data: p } = useSuspenseQuery(profileQuery);
  const qc = useQueryClient();
  const [f, setF] = useState({
    display_name: p?.display_name ?? "",
    age: p?.age?.toString() ?? "",
    height_cm: p?.height_cm?.toString() ?? "",
    weight_kg: p?.weight_kg?.toString() ?? "",
    fitness_goal: p?.fitness_goal ?? "",
  });
  const num = (v: string) => (v === "" ? null : Number(v));

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from("profiles").update({
      display_name: f.display_name,
      age: num(f.age),
      height_cm: num(f.height_cm),
      weight_kg: num(f.weight_kg),
      fitness_goal: f.fitness_goal,
    }).eq("id", p!.id);
    if (error) return toast.error(error.message);
    toast.success("Profile saved");
    qc.invalidateQueries({ queryKey: ["profile"] });
  }

  const field = (k: keyof typeof f, label: string, type = "text") => (
    <div>
      <Label htmlFor={k}>{label}</Label>
      <Input id={k} type={type} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} />
    </div>
  );

  return (
    <AppShell title="Profile">
      <form onSubmit={save} className="rounded-2xl bg-card border p-6 grid sm:grid-cols-2 gap-4 max-w-2xl">
        {field("display_name", "Name")}
        {field("age", "Age", "number")}
        {field("height_cm", "Height (cm)", "number")}
        {field("weight_kg", "Weight (kg)", "number")}
        <div className="sm:col-span-2">{field("fitness_goal", "Main goal (e.g. lose 5 kg, run a 10K)")}</div>
        <div className="sm:col-span-2 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Google Fit: {p?.fit_connected ? "Connected" : "Not connected"}</span>
          <Button type="submit">Save profile</Button>
        </div>
      </form>
    </AppShell>
  );
}
