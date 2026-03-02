import { useMemo, useState } from "react";
import { useAuth, useStore } from "../lib/store";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import ProjectCard from "../components/ProjectCard";
import { Input } from "../components/ui/input";
import { Search, SlidersHorizontal, LayoutGrid, List, Plus } from "lucide-react";
import { Button } from "../components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Sheet, SheetTrigger } from "../components/ui/sheet";
import ProjectCreateDialog from "../components/ProjectCreateDialog";

export default function Projects() {
    const { user } = useAuth();
    const { selectors } = useStore();
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [view, setView] = useState<"grid" | "list">("grid");
    const [projectOpen, setProjectOpen] = useState(false);

    const projects = useMemo(() => (user ? selectors.userProjects(user.id) : []), [selectors, user]);

    const filtered = useMemo(() => {
        return projects.filter(p =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.description?.toLowerCase().includes(search.toLowerCase())
        ).sort((a, b) => b.createdAt - a.createdAt);
    }, [projects, search]);

    if (!user) return null;

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Header Section */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight">Project Portfolio</h1>
                        <p className="text-muted-foreground mt-1">Manage and track all your active workspace initiatives.</p>
                    </div>
                    <Sheet open={projectOpen} onOpenChange={setProjectOpen}>
                        <SheetTrigger asChild>
                            <Button className="bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20">
                                <Plus className="mr-2 h-4 w-4" /> Create New Project
                            </Button>
                        </SheetTrigger>
                        <ProjectCreateDialog onCreated={() => setProjectOpen(false)} />
                    </Sheet>
                </div>

                {/* Toolbar Section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between bg-card/40 p-4 rounded-2xl border backdrop-blur-sm">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Filter projects by name or keywords..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 bg-background/50 border-none shadow-none focus-visible:ring-1"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="h-8 w-px bg-border hidden sm:block mx-2" />
                        <Tabs value={view} onValueChange={(v) => setView(v as any)}>
                            <TabsList className="bg-muted/50">
                                <TabsTrigger value="grid" className="p-2"><LayoutGrid className="h-4 w-4" /></TabsTrigger>
                                <TabsTrigger value="list" className="p-2"><List className="h-4 w-4" /></TabsTrigger>
                            </TabsList>
                        </Tabs>
                        <Button variant="outline" size="icon" className="border-none bg-muted/30">
                            <SlidersHorizontal className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Projects Display */}
                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed rounded-3xl bg-muted/5">
                        <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
                            <LayoutGrid className="h-10 w-10 text-muted-foreground/30" />
                        </div>
                        <h2 className="text-xl font-bold">No Projects Found</h2>
                        <p className="text-muted-foreground max-w-xs mx-auto mt-2">
                            {search ? "Adjust your search to find what you're looking for." : "Get started by creating your first organizational project."}
                        </p>
                    </div>
                ) : (
                    <div className={view === "grid"
                        ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                        : "flex flex-col gap-4"
                    }>
                        {filtered.map((p, idx) => (
                            <ProjectCard
                                key={p.id}
                                name={p.name}
                                members={selectors.projectMembers(p.id)}
                                tasks={selectors.tasksByProject(p.id)}
                                tint={idx % 2 === 0 ? "teal" : "blue"}
                                onOpen={() => navigate(`/project/${p.id}`)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
