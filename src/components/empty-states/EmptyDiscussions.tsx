import { MessageSquare } from "lucide-react";
import { EmptyState } from "./EmptyState";

interface EmptyDiscussionsProps {
  onStart?: () => void;
}

export const EmptyDiscussions = ({ onStart }: EmptyDiscussionsProps) => {
  return (
    <EmptyState
      icon={MessageSquare}
      title="No messages yet"
      description="Start the conversation! Discussions help your team communicate and stay aligned on project progress."
      actionLabel={onStart ? "Send Message" : undefined}
      onAction={onStart}
    />
  );
};
