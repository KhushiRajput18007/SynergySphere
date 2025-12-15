import { Card, CardContent } from "../components/ui/card";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { idToInitials, Task, TaskStatus, User } from "../lib/store";

export default function ProjectCard({
  name,
  members,
  tasks,
  onOpen,
  tint = "teal",
}: {
  name: string;
  members: User[];
  tasks: Task[];
  onOpen: () => void;
  tint?: "teal" | "blue";
}) {
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "done").length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);
  const headerClass = tint === "teal" ? "bg-teal-600" : "bg-sky-700";

  return (
    <Card className="overflow-hidden">
      <div className={`${headerClass} text-white p-4`}> 
        <div className="flex items-center justify-between">
          <div className="font-semibold truncate">{name}</div>
          <div className="text-xs opacity-90">{percent}% Complete</div>
        </div>
        <div className="mt-3 flex -space-x-2">
          {members.slice(0, 4).map((m) => (
            <Avatar key={m.id} className="h-6 w-6 ring-2 ring-white/80">
              <AvatarFallback className="text-[10px] bg-white/20">{idToInitials(m.name)}</AvatarFallback>
            </Avatar>
          ))}
          {members.length > 4 && (
            <div className="ml-2 text-xs">+{members.length - 4}</div>
          )}
        </div>
      </div>
      <CardContent className="p-4">
        <div className="text-xs text-muted-foreground">Progress</div>
        <Progress value={percent} className="mt-1" />
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <div>
            {count(tasks, "todo")} To‑Do • {count(tasks, "inprogress")} In Progress • {done} Done
          </div>
          <Button size="sm" onClick={onOpen}>Open</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function count(tasks: Task[], status: TaskStatus) {
  return tasks.filter((t) => t.status === status).length;
}
