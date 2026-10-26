import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Activity, MessageCircle, CalendarDays, Target, User, LogOut, HeartPulse } from "lucide-react";
import type { ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: Activity },
  { to: "/coach", label: "AI Coach", icon: MessageCircle },
  { to: "/plan", label: "Weekly Plan", icon: CalendarDays },
  { to: "/goals", label: "Goals", icon: Target },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function AppShell({ title, children, actions }: { title: string; children: ReactNode; actions?: ReactNode }) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }
  return (
    <div className="min-h-screen md:flex">
      <aside className="bg-sidebar text-sidebar-foreground md:w-60 md:min-h-screen flex md:flex-col gap-1 p-3 md:p-5 overflow-x-auto">
        <Link to="/dashboard" className="hidden md:flex items-center gap-2 mb-8 font-display text-xl font-semibold">
          <HeartPulse className="text-sidebar-primary" /> Pulse
        </Link>
        {nav.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm whitespace-nowrap hover:bg-sidebar-accent transition-colors"
            activeProps={{ className: "bg-sidebar-accent text-sidebar-primary font-semibold" }}
          >
            <Icon size={18} /> {label}
          </Link>
        ))}
        <button
          onClick={signOut}
          className="md:mt-auto flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-sidebar-accent"
        >
          <LogOut size={18} /> Sign out
        </button>
      </aside>
      <main className="flex-1 p-5 md:p-10 max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <h1 className="text-3xl font-semibold">{title}</h1>
          {actions}
        </div>
        {children}
      </main>
    </div>
  );
}
