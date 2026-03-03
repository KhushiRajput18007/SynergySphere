import { CheckSquare, Plus } from "lucide-react";
import { EmptyState } from "./EmptyState";

interface EmptyTasksProps {
  onCreate: () => void;
}

export const EmptyTasks = ({ onCreate }: EmptyTasksProps) => {
  return (
    <EmptyState
      icon={CheckSquare}
      title="No tasks found"
      description="Add a task to track your work! Tasks help you organize what needs to be done and assign work to team members."
      actionLabel="Add Task"
      onAction={onCreate}
    />
  );
};
