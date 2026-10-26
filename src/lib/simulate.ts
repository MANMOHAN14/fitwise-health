// Simulated Google Fit data generator (deterministic per user + day).
function seeded(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

function hash(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h) + 1;
}

export type DayMetrics = {
  day: string;
  steps: number;
  calories: number;
  active_minutes: number;
  heart_rate: number;
  sleep_hours: number;
  weight_kg: number;
};

export function simulateFit(userId: string, days: number, baseWeight = 72, today = new Date()): DayMetrics[] {
  const out: DayMetrics[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setUTCDate(d.getUTCDate() - i);
    const day = d.toISOString().slice(0, 10);
    const r = seeded(hash(userId + day));
    const weekend = d.getUTCDay() === 0 || d.getUTCDay() === 6;
    const steps = Math.round(4500 + r() * 7000 + (weekend ? 1500 : 0));
    const active = Math.round(steps / 220 + r() * 15);
    out.push({
      day,
      steps,
      active_minutes: active,
      calories: Math.round(1700 + steps * 0.045 + active * 4),
      heart_rate: Math.round(62 + r() * 14),
      sleep_hours: Math.round((5.6 + r() * 2.8) * 10) / 10,
      weight_kg: Math.round((baseWeight + (i / days) * 1.2 + (r() - 0.5) * 0.6) * 10) / 10,
    });
  }
  return out;
}
