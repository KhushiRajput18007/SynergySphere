import { Users, Mail } from "lucide-react";
import { EmptyState } from "./EmptyState";

interface EmptyMembersProps {
  onInvite: () => void;
}

export const EmptyMembers = ({ onInvite }: EmptyMembersProps) => {
  return (
    <EmptyState
      icon={Users}
      title="No team members"
      description="Invite colleagues to collaborate! Team members can work together on projects, tasks, and discussions."
      actionLabel="Invite Member"
      onAction={onInvite}
    />
  );
};
