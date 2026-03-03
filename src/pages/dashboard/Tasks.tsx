import { useState } from "react";
import { Plus, Filter, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

type TaskStatus = "todo" | "in-progress" | "done";
type TaskPriority = "low" | "medium" | "high";

interface Task {
  id: string;
  title: string;
  project: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
}

const mockTasks: Task[] = [
  { id: "1", title: "Design login page", project: "Mobile App", status: "todo", priority: "high", assignee: "Ahmed" },
  { id: "2", title: "Setup API routes", project: "API Integration", status: "todo", priority: "medium", assignee: "Sara" },
  { id: "3", title: "Dashboard layout", project: "Website", status: "in-progress", priority: "high", assignee: "Ali" },
  { id: "4", title: "Auth middleware", project: "API Integration", status: "in-progress", priority: "low", assignee: "Fatima" },
  { id: "5", title: "Wireframe approval", project: "Mobile App", status: "done", priority: "medium", assignee: "Hassan" },
  { id: "6", title: "Database schema", project: "API Integration", status: "done", priority: "high", assignee: "Ahmed" },
];

const columns: { key: TaskStatus; label: string; color: string }[] = [
  { key: "todo", label: "To-Do", color: "bg-accent" },
  { key: "in-progress", label: "In Process", color: "bg-warning" },
  { key: "done", label: "Done", color: "bg-primary" },
];

const priorityStyles: Record<TaskPriority, string> = {
  low: "bg-accent/20 text-accent",
  medium: "bg-warning/20 text-warning",
  high: "bg-destructive/20 text-destructive",
};

const Tasks = () => {
  const [tasks, setTasks] = useState(mockTasks);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">Tasks</h1>
          <p className="text-muted-foreground font-medium">Track and manage all your tasks</p>
        </div>
        <div className="flex gap-3">
          <button className="clay-button bg-muted text-foreground px-4 py-2.5 flex items-center gap-2 text-sm font-bold">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="clay-button bg-primary text-primary-foreground px-5 py-2.5 flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" /> Add Task
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {columns.map((col) => {
          const colTasks = tasks.filter(t => t.status === col.key);
          return (
            <div key={col.key} className="clay-card-inset p-4 min-h-[400px]">
              <div className="flex items-center gap-2 mb-4">
                <div className={cn("w-3 h-3 rounded-full", col.color)} />
                <span className="text-sm font-bold uppercase">{col.label}</span>
                <span className="clay-badge bg-muted text-muted-foreground px-2 py-0.5 text-xs ml-auto">{colTasks.length}</span>
              </div>
              <div className="space-y-3">
                {colTasks.map((task) => (
                  <div key={task.id} className="clay-card p-4 cursor-grab active:cursor-grabbing group">
                    <div className="flex items-start gap-2">
                      <GripVertical className="w-4 h-4 text-muted-foreground mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      <div className="flex-1">
                        <h4 className="text-sm font-bold mb-1">{task.title}</h4>
                        <p className="text-xs text-muted-foreground font-medium mb-2">{task.project}</p>
                        <div className="flex items-center justify-between">
                          <span className={cn("clay-badge px-2 py-0.5 text-xs", priorityStyles[task.priority])}>
                            {task.priority}
                          </span>
                          <div className="clay-card w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                            {task.assignee[0]}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Tasks;
