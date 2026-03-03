import { Bell } from "lucide-react";
import { EmptyState } from "./EmptyState";

export const EmptyNotifications = () => {
  return (
    <EmptyState
      icon={Bell}
      title="No notifications"
      description="You're all caught up! Notifications will appear here when you receive project invitations, task assignments, or updates."
    />
  );
};
