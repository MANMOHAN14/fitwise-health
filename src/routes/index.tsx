import { createFileRoute, Link } from "@tanstack/react-router";
import { HeartPulse, Activity, MessageCircle, CalendarDays, Target } from "lucide-react";
import hero from "@/assets/hero.jpg";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pulse — AI Personal Health Coach with Google Fit" },
      { name: "description", content: "Sync Google Fit, chat with an AI coach, track goals and get weekly workout and meal plans." },
      { property: "og:title", content: "Pulse — AI Personal Health Coach" },
      { property: "og:description", content: "Your Google Fit data, turned into personal coaching by AI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const features = [
  { icon: Activity, title: "Google Fit sync", text: "Steps, heart rate, sleep and calories in one dashboard." },
  { icon: MessageCircle, title: "AI chat coach", text: "Ask anything. Answers use your real numbers." },
  { icon: CalendarDays, title: "Weekly plans", text: "Personal workouts and meals, generated in seconds." },
  { icon: Target, title: "Goals", text: "Set targets and watch your progress grow." },
];

function Index() {
  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between px-6 md:px-12 py-5">
        <div className="flex items-center gap-2 font-display text-xl font-semibold">
          <HeartPulse className="text-accent" /> Pulse
        </div>
        <Button asChild variant="outline"><Link to="/auth">Sign in</Link></Button>
      </header>
      <section className="grid md:grid-cols-2 gap-10 items-center px-6 md:px-12 py-10">
        <div>
          <span className="inline-block rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground mb-5">
            Powered by Google Fit + AI
          </span>
          <h1 className="text-5xl md:text-6xl font-semibold leading-[1.05]">
            Your body's data,<br /><span className="text-primary">coached by AI.</span>
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-md">
            Pulse reads your activity, sleep and heart rate and turns them into a personal plan you'll actually follow.
          </p>
          <div className="mt-8 flex gap-3">
            <Button asChild size="lg"><Link to="/auth">Start coaching free</Link></Button>
          </div>
        </div>
        <img src={hero} alt="Runner tying shoes at sunrise" width={1280} height={1024} className="rounded-3xl shadow-soft object-cover aspect-[5/4] w-full" />
      </section>
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 px-6 md:px-12 pb-16">
        {features.map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-2xl bg-card border p-6">
            <Icon className="text-accent mb-3" />
            <h3 className="font-semibold text-lg">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{text}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
