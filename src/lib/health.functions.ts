import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { simulateFit } from "./simulate";

type Ctx = { supabase: any; userId: string };

async function buildContext({ supabase, userId }: Ctx) {
  const [{ data: profile }, { data: fit }, { data: goals }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
    supabase.from("fitness_data").select("*").eq("user_id", userId).order("day", { ascending: false }).limit(14),
    supabase.from("goals").select("metric,target").eq("user_id", userId),
  ]);
  return `USER PROFILE: ${JSON.stringify(profile ?? {})}
GOALS: ${JSON.stringify(goals ?? [])}
LAST 14 DAYS OF GOOGLE FIT DATA (newest first): ${JSON.stringify(
    (fit ?? []).map(({ id, user_id, ...r }: any) => r),
  )}`;
}

const COACH = `You are Pulse, a friendly, evidence-based AI personal health coach. Use the user's Google Fit data, profile and goals to give specific, actionable, encouraging advice. Reference actual numbers. Keep answers concise and use markdown (short headings, bullet lists). You are not a doctor: for symptoms or medical conditions, recommend seeing a healthcare professional.`;

export const syncGoogleFit = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: profile } = await supabase.from("profiles").select("weight_kg").eq("id", userId).maybeSingle();
    const rows = simulateFit(userId, 30, Number(profile?.weight_kg) || 72).map((r) => ({ ...r, user_id: userId }));
    const { error } = await supabase.from("fitness_data").upsert(rows, { onConflict: "user_id,day" });
    if (error) throw new Error(error.message);
    const { error: pErr } = await supabase
      .from("profiles")
      .update({ fit_connected: true, last_sync: new Date().toISOString() })
      .eq("id", userId);
    if (pErr) throw new Error(pErr.message);
    return { synced: rows.length };
  });

export const sendCoachMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { message: string }) => {
    const message = String(input?.message ?? "").trim();
    if (!message || message.length > 2000) throw new Error("Message must be 1-2000 characters.");
    return { message };
  })
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error: insErr } = await supabase
      .from("chat_messages")
      .insert({ user_id: userId, role: "user", content: data.message });
    if (insErr) throw new Error(insErr.message);
    const { data: history } = await supabase
      .from("chat_messages")
      .select("role,content")
      .eq("user_id", userId)
      .order("created_at", { ascending: true })
      .limit(40);
    const { askCoach } = await import("./ai.server");
    const reply = await askCoach(`${COACH}\n\n${await buildContext({ supabase, userId })}`, (history ?? []).map((m: any) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: m.content,
    })));
    const { error } = await supabase.from("chat_messages").insert({ user_id: userId, role: "assistant", content: reply });
    if (error) throw new Error(error.message);
    return { reply };
  });

export const generateWeeklyPlan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { askCoach } = await import("./ai.server");
    const content = await askCoach(`${COACH}\n\n${await buildContext({ supabase, userId })}`, [
      {
        role: "user",
        content:
          "Create my personalised 7-day plan. For each day (Monday to Sunday) give a '### Day' heading, then **Workout** (type, duration, intensity) and **Meals** (breakfast, lunch, dinner, snack) plus one recovery/sleep tip. Base it on my recent activity, sleep and goals. Start with a 2-sentence summary of why the plan fits my data.",
      },
    ]);
    const { error } = await supabase.from("weekly_plans").insert({ user_id: userId, content });
    if (error) throw new Error(error.message);
    return { content };
  });
