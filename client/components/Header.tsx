import { useNavigate } from "react-router-dom";
import { useAuth, idToInitials, useStore } from "../lib/store";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Bell, HelpCircle, MessageSquare, Users, ClipboardList, Plus, ListTodo, Search, Info, CheckCircle2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { Badge } from "../components/ui/badge";
import { ScrollArea } from "../components/ui/scroll-area";
import { useMemo, useState } from "react";
import { Input } from "../components/ui/input";
import { Sheet, SheetTrigger } from "../components/ui/sheet";
import ProjectCreateDialog from "../components/ProjectCreateDialog";
import TaskCreateDialog from "../components/TaskCreateDialog";
import InviteDialog from "../components/InviteDialog";
import AIAssistantDrawer from "../components/AIAssistantDrawer";
import { summarizeNotifications } from "../lib/ai";
import { cn } from "../lib/utils";

export default function Header() {
  const { user } = useAuth();
  const { state, selectors, dispatch } = useStore();
  const navigate = useNavigate();
  const [projectOpen, setProjectOpen] = useState(false);
  const [taskOpen, setTaskOpen] = useState(false);

  const notifications = useMemo(() => (user ? selectors.notificationsForUser(user.id) : []), [selectors, user]);
  const unreadTotal = useMemo(() => (user ? selectors.unreadCount(user.id) : 0), [selectors, user]);

  const [summary, setSummary] = useState<string>("");
  const summarize = () => {
    if (!user) return;
    setSummary(summarizeNotifications(state, user.id));
  };

  const unreadOnly = useMemo(() =>
    notifications.filter(n => !n.read)
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 5),
    [notifications]
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto grid h-16 max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-3 px-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="SynergySphere" className="h-8 w-8" />
          <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            SynergySphere
          </span>
        </div>

        {user ? (
          <div className="flex items-center gap-2 md:gap-3">
            <div className="relative hidden sm:block w-[320px]">
              <Input placeholder="Find projects & tasks..." className="pl-8 h-9" />
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>

            <Sheet open={projectOpen} onOpenChange={setProjectOpen}>
              <SheetTrigger asChild>
                <button className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 shadow-sm shadow-primary/20">
                  <Plus className="h-4 w-4" />
                  <span className="hidden lg:inline">New Project</span>
                  <span className="lg:hidden">Project</span>
                </button>
              </SheetTrigger>
              <ProjectCreateDialog onCreated={() => setProjectOpen(false)} />
            </Sheet>

            <Sheet open={taskOpen} onOpenChange={setTaskOpen}>
              <SheetTrigger asChild>
                <button className="inline-flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm font-medium hover:bg-accent shadow-sm">
                  <ListTodo className="h-4 w-4" />
                  <span className="hidden lg:inline">New Task</span>
                  <span className="lg:hidden">Task</span>
                </button>
              </SheetTrigger>
              <TaskCreateDialog onCreated={() => setTaskOpen(false)} />
            </Sheet>

            <div className="hidden md:block">
              <InviteDialog />
            </div>
          </div>
        ) : <div />}

        <div className="ml-auto flex items-center gap-3">
          {!user && (
            <>
              <button
                onClick={() => navigate("/auth")}
                className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/auth?mode=signup")}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                Sign Up
              </button>
            </>
          )}

          {user && <AIAssistantDrawer />}

          {user && (
            <Popover>
              <PopoverTrigger asChild>
                <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-accent" aria-label="Notifications">
                  <Bell className="h-4 w-4" />
                  {unreadTotal > 0 && (
                    <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1 text-xs font-medium text-white shadow-lg">
                      {unreadTotal > 99 ? "99+" : unreadTotal}
                    </span>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-[400px] p-0 overflow-hidden rounded-2xl border-none shadow-2xl">
                <div className="p-4 border-b bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-lg">Alerts & Updates</h4>
                    <Badge variant="secondary" className="bg-white/20 text-white border-none">{unreadTotal} New</Badge>
                  </div>
                  <p className="text-xs text-indigo-100 mt-1 opacity-80">Showing the latest urgent updates.</p>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/30 border-b">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    <Info className="h-3 w-3" />
                    AI Insights
                  </div>
                  <button
                    onClick={summarize}
                    className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold hover:bg-primary/20 transition-colors"
                  >
                    Sum it up
                  </button>
                </div>

                {summary && (
                  <div className="p-3 bg-amber-50 text-[11px] text-amber-800 leading-relaxed italic border-b animate-in fade-in slide-in-from-top-2">
                    "{summary}"
                  </div>
                )}

                <ScrollArea className="max-h-[350px]">
                  {unreadOnly.length === 0 ? (
                    <div className="p-10 text-center flex flex-col items-center gap-2">
                      <CheckCircle2 className="h-10 w-10 text-green-500/30" />
                      <div className="text-sm font-semibold text-muted-foreground">All caught up!</div>
                      <p className="text-xs text-muted-foreground/60">No new unread notifications at the moment.</p>
                    </div>
                  ) : (
                    <ul className="divide-y">
                      {unreadOnly.map((n) => (
                        <li key={n.id} className="flex items-start gap-4 p-4 hover:bg-muted/50 transition-colors group">
                          <div className={cn(
                            "mt-0.5 rounded-xl p-2",
                            n.category === "messages" ? "bg-blue-100 text-blue-600" :
                              n.category === "team" ? "bg-amber-100 text-amber-600" :
                                "bg-violet-100 text-violet-600"
                          )}>
                            {n.category === "messages" ? (
                              <MessageSquare className="h-4 w-4" />
                            ) : n.category === "team" ? (
                              <Users className="h-4 w-4" />
                            ) : (
                              <ClipboardList className="h-4 w-4" />
                            )}
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="text-[13px] font-medium leading-snug">{n.message}</div>
                            <div className="text-[10px] text-muted-foreground flex items-center justify-between">
                              <span>{timeAgo(n.createdAt)}</span>
                              <button
                                onClick={() => dispatch({ type: "markNotification", payload: { id: n.id, read: true } })}
                                className="text-primary opacity-0 group-hover:opacity-100 transition-opacity font-bold"
                              >
                                Done
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </ScrollArea>
                <div
                  onClick={() => navigate("/notifications")}
                  className="border-t p-4 text-center text-xs font-bold text-primary hover:bg-muted/50 cursor-pointer transition-colors bg-muted/20"
                >
                  VIEW FULL HISTORY
                </div>
              </PopoverContent>
            </Popover>
          )}

          {user && (
            <button className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-accent" aria-label="Help">
              <HelpCircle className="h-4 w-4" />
            </button>
          )}

          {user ? (
            <div onClick={() => navigate("/profile")} className="cursor-pointer">
              <Avatar className="h-9 w-9">
                <AvatarFallback>{idToInitials(user.name)}</AvatarFallback>
              </Avatar>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}d`;
}
