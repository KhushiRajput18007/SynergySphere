import { FolderKanban, Plus } from "lucide-react";
import { EmptyState } from "./EmptyState";

interface EmptyProjectsProps {
  onCreate: () => void;
}

export const EmptyProjects = ({ onCreate }: EmptyProjectsProps) => {
  return (
    <EmptyState
      icon={FolderKanban}
      title="No projects yet"
      description="Create your first project to get started! Projects help you organize tasks and collaborate with your team."
      actionLabel="Create Project"
      onAction={onCreate}
    />
  );
};
