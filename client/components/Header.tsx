import { useNavigate } from "react-router-dom";
import { useAuth, idToInitials, useStore } from "../lib/store";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Bell, HelpCircle, MessageSquare, Users, ClipboardList, Plus, ListTodo, Search } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { ScrollArea } from "../components/ui/scroll-area";
import { useMemo, useState } from "react";
import { Input } from "../components/ui/input";
import { Dialog, DialogTrigger } from "../components/ui/dialog";
import ProjectCreateDialog from "../components/ProjectCreateDialog";
import TaskCreateDialog from "../components/TaskCreateDialog";
import InviteDialog from "../components/InviteDialog";
import AIAssistantDrawer from "../components/AIAssistantDrawer";
import { summarizeNotifications } from "../lib/ai";

export default function Header() {
  const { user } = useAuth();
  const { state, selectors, dispatch } = useStore();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"all" | "tasks" | "messages" | "team">("all");

  const notifications = useMemo(() => (user ? selectors.notificationsForUser(user.id) : []), [selectors, user]);
  const unreadTotal = useMemo(() => (user ? selectors.unreadCount(user.id) : 0), [selectors, user]);
  const counts = {
    tasks: user ? selectors.unreadCount(user.id, "tasks") : 0,
    messages: user ? selectors.unreadCount(user.id, "messages") : 0,
    team: user ? selectors.unreadCount(user.id, "team") : 0,
  } as const;

  const filtered = notifications.filter((n) => (tab === "all" ? true : n.category === tab));

  const markAllRead = () => {
    notifications.forEach((n) => {
      if (!n.read) dispatch({ type: "markNotification", payload: { id: n.id, read: true } });
    });
  };
  const clearAll = () => {
    if (user) dispatch({ type: "clearNotificationsForUser", payload: { userId: user.id } });
  };
  const [summary, setSummary] = useState<string>("");
  const summarize = () => {
    if (!user) return;
    setSummary(summarizeNotifications(state, user.id));
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto] items-center gap-3 px-4">
        {user ? (
          <div className="flex items-center gap-2 md:gap-3">
            <div className="relative hidden sm:block w-[320px]">
              <Input placeholder="Find projects & tasks..." className="pl-8 h-9" />
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <button className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
                  <Plus className="h-4 w-4" /> New Project
                </button>
              </DialogTrigger>
              <ProjectCreateDialog onCreated={() => {}} />
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <button className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium hover:bg-accent">
                  <ListTodo className="h-4 w-4" /> New Task
                </button>
              </DialogTrigger>
              <TaskCreateDialog onCreated={() => {}} />
            </Dialog>
            <div className="hidden md:block">
              <InviteDialog />
            </div>
          </div>
        ) : <div />}
        <div className="ml-auto flex items-center gap-3">
          <AIAssistantDrawer />
          <Popover>
            <PopoverTrigger asChild>
              <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-accent" aria-label="Notifications">
                <Bell className="h-4 w-4" />
                {unreadTotal > 0 && (
                  <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1 text-xs font-medium text-white">
                    {unreadTotal > 99 ? "99+" : unreadTotal}
                  </span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-96 p-0">
              <div className="border-b px-3 py-2 space-y-2">
                <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
                  <div className="flex items-center justify-between gap-2">
                    <TabsList>
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="tasks">Tasks {counts.tasks ? `(${counts.tasks})` : ""}</TabsTrigger>
                      <TabsTrigger value="messages">Messages {counts.messages ? `(${counts.messages})` : ""}</TabsTrigger>
                      <TabsTrigger value="team">Team {counts.team ? `(${counts.team})` : ""}</TabsTrigger>
                    </TabsList>
                    <div className="flex items-center gap-2">
                      <button className="text-xs text-muted-foreground hover:text-foreground" onClick={markAllRead}>Mark all as read</button>
                      <span className="text-muted-foreground">•</span>
                      <button className="text-xs text-muted-foreground hover:text-foreground" onClick={clearAll}>Clear</button>
                    </div>
                  </div>
                </Tabs>
                <div className="flex items-start justify-between gap-2 rounded-md bg-accent/40 p-2 text-xs">
                  <div className="min-w-0 text-muted-foreground">
                    {summary ? summary : "Get an AI summary of your latest notifications."}
                  </div>
                  <button className="shrink-0 rounded-md border px-2 py-1 hover:bg-accent" onClick={summarize}>Summarize</button>
                </div>
              </div>
              <ScrollArea className="max-h-96">
                <ul className="divide-y">
                  {filtered.length === 0 && (
                    <li className="p-4 text-sm text-muted-foreground">No notifications</li>
                  )}
                  {filtered.map((n) => (
                    <li key={n.id} className="flex items-start gap-3 p-3 hover:bg-accent/50">
                      <div className="mt-0.5 rounded-full bg-primary/10 p-1 text-primary">
                        {n.category === "messages" ? (
                          <MessageSquare className="h-4 w-4" />
                        ) : n.category === "team" ? (
                          <Users className="h-4 w-4" />
                        ) : (
                          <ClipboardList className="h-4 w-4" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm leading-snug">{n.message}</div>
                        <div className="mt-1 text-xs text-muted-foreground">{timeAgo(n.createdAt)}</div>
                      </div>
                      {!n.read && <span className="mt-1 h-2 w-2 rounded-full bg-primary" />}
                    </li>
                  ))}
                </ul>
              </ScrollArea>
              <div className="border-t px-3 py-2 text-center text-sm text-primary hover:underline">View full notifications history</div>
            </PopoverContent>
          </Popover>
          <button className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-accent" aria-label="Help">
            <HelpCircle className="h-4 w-4" />
          </button>
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
