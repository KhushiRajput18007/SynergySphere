import Sidebar from "../components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { useAuth, useStore } from "../lib/store";
import { Bell, MessageSquare, Users, ClipboardList, CheckCircle2, Trash2, SlidersHorizontal, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { ScrollArea } from "../components/ui/scroll-area";
import { cn } from "../lib/utils";
import DashboardLayout from "../components/DashboardLayout";

export default function Notifications() {
    const { user } = useAuth();
    const { state, selectors, dispatch, respondToInvitation } = useStore();
    const [filter, setFilter] = useState<"all" | "tasks" | "messages" | "team" | "invitation">("all");
    const [showUnreadOnly, setShowUnreadOnly] = useState(false);

    const notifications = useMemo(() => {
        if (!user) return [];
        let items = selectors.notificationsForUser(user.id);
        if (filter !== "all") {
            items = items.filter(n => n.category === filter);
        }
        if (showUnreadOnly) {
            items = items.filter(n => !n.read);
        }
        return items.sort((a, b) => b.createdAt - a.createdAt);
    }, [selectors, user, filter, showUnreadOnly]);

    const handleInvitation = async (notifId: string, projectId: string, action: 'accepted' | 'declined') => {
        try {
            await respondToInvitation(projectId, action);
            dispatch({ type: "markNotification", payload: { id: notifId, read: true } });
        } catch (err) {
            console.error("Invitation error:", err);
        }
    };

    const markRead = (id: string) => {
        dispatch({ type: "markNotification", payload: { id, read: true } });
    };

    const markAllRead = () => {
        notifications.forEach(n => {
            if (!n.read) markRead(n.id);
        });
    };

    const deleteNotification = (id: string) => {
        dispatch({ type: "deleteNotification", payload: { id } });
    };

    const clearAll = () => {
        if (user) {
            dispatch({ type: "clearNotificationsForUser", payload: { userId: user.id } });
        }
    };

    if (!user) return null;

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
                        <p className="text-muted-foreground mt-1 text-sm">Manage your alerts, updates, and communications.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button onClick={markAllRead} variant="outline" size="sm" className="h-9 font-semibold">
                            <CheckCircle2 className="mr-2 h-4 w-4" /> Mark all read
                        </Button>
                        <Button onClick={clearAll} variant="destructive" size="sm" className="h-9 font-semibold">
                            <Trash2 className="mr-2 h-4 w-4" /> Clear all
                        </Button>
                    </div>
                </div>

                <Card className="border-none shadow-2xl bg-card/60 backdrop-blur-md overflow-hidden">
                    <CardHeader className="pb-3 border-b bg-muted/20">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <Tabs value={filter} onValueChange={(v) => setFilter(v as any)} className="w-full sm:w-auto">
                                <TabsList className="bg-muted/50 p-1">
                                    <TabsTrigger value="all" className="px-5 font-bold text-xs uppercase tracking-tight transition-all">All</TabsTrigger>
                                    <TabsTrigger value="tasks" className="px-5 font-bold text-xs uppercase tracking-tight transition-all">Tasks</TabsTrigger>
                                    <TabsTrigger value="messages" className="px-5 font-bold text-xs uppercase tracking-tight transition-all">Messages</TabsTrigger>
                                    <TabsTrigger value="team" className="px-5 font-bold text-xs uppercase tracking-tight transition-all">Team</TabsTrigger>
                                </TabsList>
                            </Tabs>
                            <div className="flex items-center gap-5 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                <div className="flex items-center gap-3">
                                    <span className={cn(showUnreadOnly ? "text-primary" : "text-muted-foreground")}>Unread Only</span>
                                    <button
                                        className={cn(
                                            "relative h-5 w-10 rounded-full transition-colors focus:outline-none",
                                            showUnreadOnly ? "bg-primary" : "bg-muted-foreground/30"
                                        )}
                                        onClick={() => setShowUnreadOnly(!showUnreadOnly)}
                                    >
                                        <div className={cn(
                                            "absolute top-1 h-3 w-3 rounded-full bg-white transition-all shadow-sm",
                                            showUnreadOnly ? "left-6" : "left-1"
                                        )} />
                                    </button>
                                </div>
                                <div className="h-4 w-px bg-border hidden sm:block" />
                                <div className="hidden sm:flex items-center gap-1.5 opacity-60">
                                    <SlidersHorizontal className="h-3 w-3" />
                                    <span>Sorted by Date</span>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="min-h-[400px]">
                            {notifications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-32 text-center opacity-70">
                                    <div className="h-20 w-20 rounded-2xl bg-muted flex items-center justify-center mb-6 rotate-12 transition-transform hover:rotate-0">
                                        <Bell className="h-10 w-10 text-muted-foreground/50" />
                                    </div>
                                    <h3 className="text-xl font-bold tracking-tight">Clean slate!</h3>
                                    <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-2">
                                        You don't have any notifications {filter !== 'all' ? `in ${filter}` : ''} at the moment.
                                    </p>
                                </div>
                            ) : (
                                <div className="divide-y divide-border/50">
                                    {notifications.map((n) => (
                                        <div
                                            key={n.id}
                                            className={cn(
                                                "group flex items-start gap-5 p-5 transition-all hover:bg-muted/10 relative",
                                                !n.read && "bg-primary/5 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-primary"
                                            )}
                                        >
                                            <div className={cn(
                                                "mt-1 rounded-2xl p-3 shadow-sm",
                                                (n.category as string) === "messages" ? "bg-blue-50 text-blue-600" :
                                                    (n.category as string) === "team" ? "bg-amber-50 text-amber-600" :
                                                        (n.category as string) === "invitation" ? "bg-indigo-50 text-indigo-600" :
                                                            "bg-violet-50 text-violet-600"
                                            )}>
                                                {n.category === "messages" ? (
                                                    <MessageSquare className="h-6 w-6" />
                                                ) : (n.category as string) === "team" ? (
                                                    <Users className="h-6 w-6" />
                                                ) : (n.category as string) === "invitation" ? (
                                                    <Plus className="h-6 w-6" />
                                                ) : (
                                                    <ClipboardList className="h-6 w-6" />
                                                )}
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <div className="flex items-center justify-between gap-4">
                                                    <div className="font-bold text-sm sm:text-base tracking-tight">
                                                        {(n.category as string) === "invitation" ? "Project Invitation" : `${(n.category as string).charAt(0).toUpperCase() + (n.category as string).slice(1)} Update`}
                                                    </div>
                                                    <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-muted p-1 px-2 rounded-md">
                                                        {new Date(n.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                                    </div>
                                                </div>
                                                <p className={cn(
                                                    "text-sm leading-relaxed max-w-2xl",
                                                    n.read ? "text-muted-foreground" : "text-foreground font-medium"
                                                )}>
                                                    {n.message}
                                                </p>
                                                <div className="flex items-center gap-4 pt-4">
                                                    {(n.category as string) === "invitation" && !n.read ? (
                                                        <div className="flex items-center gap-2">
                                                            <Button
                                                                variant="default"
                                                                size="sm"
                                                                className="h-8 px-4 text-xs font-bold bg-green-600 hover:bg-green-700"
                                                                onClick={() => handleInvitation(n.id, n.projectId!, 'accepted')}
                                                            >
                                                                Accept Invite
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="h-8 px-4 text-xs font-bold border-red-200 text-red-600 hover:bg-red-50"
                                                                onClick={() => handleInvitation(n.id, n.projectId!, 'declined')}
                                                            >
                                                                Decline
                                                            </Button>
                                                        </div>
                                                    ) : !n.read && (
                                                        <Button
                                                            variant="default"
                                                            size="sm"
                                                            className="h-8 px-4 text-xs font-bold"
                                                            onClick={() => markRead(n.id)}
                                                        >
                                                            Mark Read
                                                        </Button>
                                                    )}
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 px-3 text-xs font-bold text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                        onClick={() => deleteNotification(n.id)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            </div>
                                            {!n.read && <div className="mt-4 h-2.5 w-2.5 rounded-full bg-primary shadow-lg shadow-primary/50 animate-pulse" />}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
