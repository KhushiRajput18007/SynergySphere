import { useMemo, useState } from "react";
import { useAuth, useStore } from "../lib/store";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Search, ClipboardList, CheckCircle2, Clock, AlertCircle, Plus } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Sheet, SheetTrigger } from "../components/ui/sheet";
import TaskCreateDialog from "../components/TaskCreateDialog";
import { cn } from "../lib/utils";

export default function Tasks() {
    const { user } = useAuth();
    const { selectors, state } = useStore();
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [taskOpen, setTaskOpen] = useState(false);

    const projects = useMemo(() => (user ? selectors.userProjects(user.id) : []), [selectors, user]);
    const allTasks = useMemo(() => {
        return projects.flatMap(p => selectors.tasksByProject(p.id))
            .sort((a, b) => b.createdAt - a.createdAt);
    }, [projects, selectors]);

    const filtered = useMemo(() => {
        return allTasks.filter(t =>
            t.title.toLowerCase().includes(search.toLowerCase()) ||
            t.description?.toLowerCase().includes(search.toLowerCase())
        );
    }, [allTasks, search]);

    if (!user) return null;

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Header Section */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight">Active Tasks</h1>
                        <p className="text-muted-foreground mt-1">Track and manage your individual responsibilities across all projects.</p>
                    </div>
                    <Sheet open={taskOpen} onOpenChange={setTaskOpen}>
                        <SheetTrigger asChild>
                            <Button className="font-bold shadow-lg">
                                <Plus className="mr-2 h-4 w-4" /> Add New Task
                            </Button>
                        </SheetTrigger>
                        <TaskCreateDialog onCreated={() => setTaskOpen(false)} />
                    </Sheet>
                </div>

                {/* Toolbar Section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between bg-card/40 p-4 rounded-2xl border backdrop-blur-sm">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by task title or description..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 bg-background/50 border-none shadow-none focus-visible:ring-1"
                        />
                    </div>
                </div>

                {/* Tasks List */}
                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed rounded-3xl bg-muted/5">
                        <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
                            <ClipboardList className="h-10 w-10 text-muted-foreground/30" />
                        </div>
                        <h2 className="text-xl font-bold">Workspace is Clear</h2>
                        <p className="text-muted-foreground max-w-xs mx-auto mt-2">
                            No tasks match your current criteria. Great job staying on top of things!
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {filtered.map((t) => {
                            const project = state.projects[t.projectId];
                            return (
                                <Card
                                    key={t.id}
                                    className="group hover:shadow-xl transition-all border-none bg-card/60 backdrop-blur-sm relative overflow-hidden cursor-pointer"
                                    onClick={() => navigate(`/project/${t.projectId}`)}
                                >
                                    {!t.status.includes('done') && (
                                        <div className={cn(
                                            "absolute left-0 top-0 bottom-0 w-1",
                                            t.priority === 'high' ? 'bg-red-500' : t.priority === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                                        )} />
                                    )}
                                    <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className={cn(
                                                "mt-1 p-2 rounded-xl shrink-0",
                                                t.status === 'done' ? 'bg-green-100 text-green-600' : 'bg-primary/10 text-primary'
                                            )}>
                                                {t.status === 'done' ? <CheckCircle2 className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <h4 className={cn("font-bold tracking-tight", t.status === 'done' && "line-through opacity-50")}>{t.title}</h4>
                                                    <Badge variant="outline" className="text-[10px] font-bold uppercase py-0 px-2 opacity-60">{project?.name}</Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-1">{t.description}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 sm:ml-auto">
                                            {t.dueDate && (
                                                <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                                    <Clock className="h-3 w-3" />
                                                    {new Date(t.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                                </div>
                                            )}
                                            <Badge className={cn(
                                                "font-bold text-[10px] uppercase px-3 py-1 border-none",
                                                t.status === 'done' ? 'bg-green-100 text-green-700' :
                                                    t.status === 'inprogress' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-muted text-muted-foreground'
                                            )}>
                                                {t.status === 'todo' ? 'To Do' : t.status === 'inprogress' ? 'In Progress' : 'Completed'}
                                            </Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
