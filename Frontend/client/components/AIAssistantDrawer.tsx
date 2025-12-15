import { useMemo, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../components/ui/sheet";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Sparkles } from "lucide-react";
import { useStore } from "../lib/store";
import { summarizeNotifications } from "../lib/ai";

export default function AIAssistantDrawer() {
  const { state, selectors } = useStore();
  const user = selectors.currentUser();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    { role: "assistant", content: "Hi! I can summarize notifications and suggest next actions. Try: 'summarize notifications'" },
  ]);

  const ask = () => {
    const q = input.trim();
    if (!q) return;
    setMessages((m) => [...m, { role: "user", content: q }]);
    setInput("");
    // Local heuristics
    let reply = "I didn't understand. Try: summarize notifications";
    if (user && /summarize|summary|notifications/i.test(q)) {
      reply = summarizeNotifications(state, user.id);
    } else if (/next\s*actions|focus|today/i.test(q)) {
      reply = "Focus on high‑priority tasks and items due this week. Check your Tasks tab for more.";
    }
    setTimeout(() => setMessages((m) => [...m, { role: "assistant", content: reply }]), 200);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-accent" aria-label="Ask AI">
          <Sparkles className="h-4 w-4" />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[420px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> Ask AI</SheetTitle>
        </SheetHeader>
        <div className="mt-4 flex h-[calc(100%-6rem)] flex-col">
          <div className="flex-1 space-y-3 overflow-auto rounded-md border p-3 text-sm">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "assistant" ? "" : "text-right"}>
                <div className={m.role === "assistant" ? "inline-block rounded-md bg-accent px-3 py-2" : "inline-block rounded-md bg-primary px-3 py-2 text-primary-foreground"}>
                  {m.content}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 grid gap-2">
            <Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask something..." rows={2} />
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2 text-xs">
                <button onClick={() => setInput("summarize notifications")} className="rounded-full border px-2 py-1 hover:bg-accent">Summarize notifications</button>
                <button onClick={() => setInput("what should I focus on today?")} className="rounded-full border px-2 py-1 hover:bg-accent">Today's focus</button>
              </div>
              <Button size="sm" onClick={ask}>Send</Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
