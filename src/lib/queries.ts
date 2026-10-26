import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

async function uid() {
  const { data } = await supabase.auth.getUser();
  if (!data.user) throw new Error("Not signed in");
  return data.user.id;
}

export const profileQuery = queryOptions({
  queryKey: ["profile"],
  queryFn: async () => {
    const id = await uid();
    const { data, error } = await supabase.from("profiles").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    return data;
  },
});

export const fitQuery = queryOptions({
  queryKey: ["fit"],
  queryFn: async () => {
    const { data, error } = await supabase.from("fitness_data").select("*").order("day", { ascending: true }).limit(60);
    if (error) throw error;
    return data ?? [];
  },
});

export const goalsQuery = queryOptions({
  queryKey: ["goals"],
  queryFn: async () => {
    const { data, error } = await supabase.from("goals").select("*").order("created_at");
    if (error) throw error;
    return data ?? [];
  },
});

export const chatQuery = queryOptions({
  queryKey: ["chat"],
  queryFn: async () => {
    const { data, error } = await supabase.from("chat_messages").select("*").order("created_at");
    if (error) throw error;
    return data ?? [];
  },
});

export const planQuery = queryOptions({
  queryKey: ["plan"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("weekly_plans")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data;
  },
});

export const METRICS = {
  steps: { label: "Daily steps", unit: "steps" },
  active_minutes: { label: "Active minutes", unit: "min" },
  sleep_hours: { label: "Sleep", unit: "hrs" },
  calories: { label: "Calories burned", unit: "kcal" },
} as const;
export type MetricKey = keyof typeof METRICS;

/** Percent of goal reached by the average of the last 7 days, capped at 100. */
export function goalProgress(values: number[], target: number) {
  if (!values.length || target <= 0) return 0;
  const recent = values.slice(-7);
  const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
  return Math.min(100, Math.round((avg / target) * 100));
}
