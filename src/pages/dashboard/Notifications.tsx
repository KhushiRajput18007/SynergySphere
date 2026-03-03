import { Bell, Check, X, FolderKanban, Users, CheckSquare, MessageSquare } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: "invite" | "task" | "message" | "update";
  title: string;
  description: string;
  time: string;
  read: boolean;
  actionable?: boolean;
}

const mockNotifications: Notification[] = [
  { id: "1", type: "invite", title: "Project Invitation", description: "Ahmed invited you to join 'Mobile App Redesign'", time: "5m ago", read: false, actionable: true },
  { id: "2", type: "invite", title: "Project Invitation", description: "Sara invited you to join 'API Integration'", time: "1h ago", read: false, actionable: true },
  { id: "3", type: "task", title: "Task Assigned", description: "You've been assigned 'Design Dashboard' in Website project", time: "2h ago", read: false },
  { id: "4", type: "message", title: "New Discussion", description: "Ali mentioned you in 'Mobile App' discussion", time: "3h ago", read: true },
  { id: "5", type: "update", title: "Task Update", description: "Fatima moved 'Login UI' to Done in Mobile App", time: "5h ago", read: true },
];

const typeIcons = {
  invite: Users,
  task: CheckSquare,
  message: MessageSquare,
  update: FolderKanban,
};

const typeColors = {
  invite: "text-primary bg-primary/10",
  task: "text-accent bg-accent/10",
  message: "text-secondary bg-secondary/10",
  update: "text-info bg-info/10",
};

const Notifications = () => {
  const [notifications, setNotifications] = useState(mockNotifications);

  const handleAccept = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleReject = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">Notifications</h1>
          <p className="text-muted-foreground font-medium">{unreadCount} unread notifications</p>
        </div>
        <button className="clay-button bg-muted text-foreground px-4 py-2 text-sm font-bold"
          onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}>
          Mark all read
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map((notification) => {
          const Icon = typeIcons[notification.type];
          return (
            <div key={notification.id} className={cn("clay-card p-5 transition-all", !notification.read && "ring-2 ring-primary/20")}>
              <div className="flex items-start gap-4">
                <div className={cn("clay-card-inset w-11 h-11 flex items-center justify-center rounded-xl shrink-0", typeColors[notification.type])}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-sm">{notification.title}</h3>
                    {!notification.read && <div className="w-2 h-2 rounded-full bg-primary" />}
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">{notification.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>

                  {notification.actionable && (
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => handleAccept(notification.id)}
                        className="clay-button bg-accent text-accent-foreground px-4 py-1.5 text-xs flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Accept
                      </button>
                      <button onClick={() => handleReject(notification.id)}
                        className="clay-button bg-destructive/10 text-destructive px-4 py-1.5 text-xs flex items-center gap-1">
                        <X className="w-3.5 h-3.5" /> Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Notifications;
