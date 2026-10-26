import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { HeartPulse, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { chatQuery } from "@/lib/queries";
import { sendCoachMessage } from "@/lib/health.functions";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/coach")({
  head: () => ({ meta: [{ title: "AI Coach — Pulse" }, { name: "description", content: "Chat with your AI health coach." }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(chatQuery),
  component: Coach,
});

const suggestions = ["How was my sleep this week?", "Am I active enough?", "Give me a quick 20-min workout", "What should I eat after a run?"];

function Coach() {
  const { data: messages } = useSuspenseQuery(chatQuery);
  const qc = useQueryClient();
  const send = useServerFn(sendCoachMessage);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  const m = useMutation({
    mutationFn: (message: string) => send({ data: { message } }),
    onMutate: (message) => setPending(message),
    onSettled: async () => {
      await qc.invalidateQueries({ queryKey: ["chat"] });
      setPending(null);
      taRef.current?.focus();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, pending]);
  useEffect(() => taRef.current?.focus(), []);

  function submit(text = input) {
    const t = text.trim();
    if (!t || m.isPending) return;
    setInput("");
    m.mutate(t);
  }

  async function clear() {
    const { error } = await supabase.from("chat_messages").delete().not("id", "is", null);
    if (error) { toast.error(error.message); return; }
    qc.invalidateQueries({ queryKey: ["chat"] });
  }

  return (
    <AppShell
      title="AI Coach"
      actions={messages.length > 0 && <Button variant="ghost" size="sm" onClick={clear}><Trash2 /> Clear chat</Button>}
    >
      <div className="rounded-3xl bg-card border flex flex-col h-[70vh]">
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {messages.length === 0 && !pending && (
            <div className="text-center py-10">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-hero grid place-items-center mb-4"><HeartPulse className="text-primary-foreground" /></div>
              <h2 className="text-xl font-semibold">I'm Pulse, your health coach</h2>
              <p className="text-muted-foreground mt-1">I can see your Google Fit data. Ask me anything.</p>
              <div className="flex flex-wrap justify-center gap-2 mt-6">
                {suggestions.map((s) => (
                  <button key={s} onClick={() => submit(s)} className="rounded-full border px-4 py-2 text-sm hover:bg-muted">{s}</button>
                ))}
              </div>
            </div>
          )}
          {messages.map((msg) => (
            <Bubble key={msg.id} role={msg.role} content={msg.content} />
          ))}
          {pending && (
            <>
              <Bubble role="user" content={pending} />
              <div className="flex gap-1 pl-12">
                {[0, 1, 2].map((i) => <span key={i} className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
              </div>
            </>
          )}
          <div ref={endRef} />
        </div>
        <form onSubmit={(e) => { e.preventDefault(); submit(); }} className="border-t p-4 flex gap-3 items-end">
          <Textarea
            ref={taRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } }}
            placeholder="Ask your coach…"
            rows={1}
            className="resize-none min-h-11"
          />
          <Button type="submit" size="icon" className="h-11 w-11 shrink-0" disabled={m.isPending || !input.trim()} aria-label="Send">
            <Send />
          </Button>
        </form>
      </div>
    </AppShell>
  );
}

function Bubble({ role, content }: { role: string; content: string }) {
  if (role === "user") {
    return <div className="flex justify-end"><div className="max-w-[80%] rounded-2xl rounded-br-sm bg-primary text-primary-foreground px-4 py-2.5 whitespace-pre-wrap">{content}</div></div>;
  }
  return (
    <div className="flex gap-3">
      <div className="w-9 h-9 shrink-0 rounded-xl bg-hero grid place-items-center"><HeartPulse size={18} className="text-primary-foreground" /></div>
      <div className="prose-coach max-w-[85%] text-sm leading-relaxed"><ReactMarkdown>{content}</ReactMarkdown></div>
    </div>
  );
}
