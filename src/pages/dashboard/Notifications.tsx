import { Bell, Check, X, FolderKanban, Users, CheckSquare, MessageSquare, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNotifications, useMarkAsRead, useMarkAllAsRead, useDeleteNotification } from "@/hooks/api/useNotifications";
import { EmptyNotifications } from "@/components/empty-states";
import { formatDistanceToNow } from "date-fns";

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
  const { data: notifications, isLoading } = useNotifications();
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();
  const deleteNotification = useDeleteNotification();

  const unreadCount = notifications?.filter(n => !n.read).length || 0;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">Notifications</h1>
          <p className="text-muted-foreground font-medium">{unreadCount} unread notifications</p>
        </div>
        <button 
          className="clay-button bg-muted text-foreground px-4 py-2 text-sm font-bold disabled:opacity-50"
          onClick={() => markAllAsRead.mutate()}
          disabled={markAllAsRead.isPending || unreadCount === 0}
        >
          {markAllAsRead.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Mark all read"
          )}
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : !notifications || notifications.length === 0 ? (
        <EmptyNotifications />
      ) : (
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
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </p>

                    {notification.actionable && (
                      <div className="flex gap-2 mt-3">
                        <button 
                          onClick={() => markAsRead.mutate(notification.id)}
                          className="clay-button bg-accent text-accent-foreground px-4 py-1.5 text-xs flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" /> Accept
                        </button>
                        <button 
                          onClick={() => deleteNotification.mutate(notification.id)}
                          className="clay-button bg-destructive/10 text-destructive px-4 py-1.5 text-xs flex items-center gap-1"
                        >
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
      )}
    </div>
  );
};

export default Notifications;
