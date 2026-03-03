import { useState } from "react";
import { Plus, Search, Users, CheckSquare, MessageSquare, MoreVertical, Calendar } from "lucide-react";

interface Project {
  id: string;
  name: string;
  description: string;
  members: number;
  tasks: { total: number; done: number };
  priority: "low" | "medium" | "high";
  dueDate: string;
}

const mockProjects: Project[] = [
  { id: "1", name: "Mobile App Redesign", description: "Complete UI overhaul of the mobile application", members: 5, tasks: { total: 24, done: 16 }, priority: "high", dueDate: "Mar 15" },
  { id: "2", name: "API Integration", description: "Build REST API endpoints for the platform", members: 3, tasks: { total: 18, done: 8 }, priority: "medium", dueDate: "Mar 22" },
  { id: "3", name: "Website Redesign", description: "Modernize the company website with new design", members: 4, tasks: { total: 12, done: 12 }, priority: "low", dueDate: "Mar 10" },
  { id: "4", name: "Analytics Dashboard", description: "Data visualization and reporting module", members: 2, tasks: { total: 8, done: 3 }, priority: "high", dueDate: "Apr 01" },
];

const priorityColors = {
  low: "bg-accent/20 text-accent",
  medium: "bg-warning/20 text-warning",
  high: "bg-destructive/20 text-destructive",
};

const Projects = () => {
  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filtered = mockProjects.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">Projects</h1>
          <p className="text-muted-foreground font-medium">Manage your team projects</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="clay-button bg-primary text-primary-foreground px-5 py-2.5 flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> New Project
        </button>
      </div>

      <div className="clay-card-inset p-1 flex items-center gap-2 max-w-md">
        <Search className="w-4 h-4 text-muted-foreground ml-3" />
        <input
          type="text"
          placeholder="Search projects..."
          className="bg-transparent outline-none text-sm font-medium w-full py-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {filtered.map((project) => {
          const progress = Math.round((project.tasks.done / project.tasks.total) * 100);
          return (
            <div key={project.id} className="clay-card p-6 cursor-pointer group">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{project.name}</h3>
                    <span className={`clay-badge px-2 py-0.5 text-xs ${priorityColors[project.priority]}`}>
                      {project.priority}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">{project.description}</p>
                </div>
                <button className="clay-card-inset w-8 h-8 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                  <span>{project.tasks.done}/{project.tasks.total} tasks</span>
                  <span>{progress}%</span>
                </div>
                <div className="clay-card-inset h-2.5 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {project.members}</span>
                  <span className="flex items-center gap-1"><CheckSquare className="w-3.5 h-3.5" /> {project.tasks.total}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {project.dueDate}</span>
                </div>
                <div className="flex -space-x-2">
                  {Array.from({ length: Math.min(3, project.members) }).map((_, i) => (
                    <div key={i} className="clay-card w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 border-card">
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                  {project.members > 3 && (
                    <div className="clay-card-inset w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold">
                      +{project.members - 3}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowCreateModal(false)}>
          <div className="clay-card p-8 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-black mb-6">Create New Project</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold mb-1.5 block">Project Name</label>
                <input type="text" className="clay-input w-full px-4 py-3 text-sm font-medium outline-none" placeholder="My Awesome Project" />
              </div>
              <div>
                <label className="text-sm font-bold mb-1.5 block">Description</label>
                <textarea className="clay-input w-full px-4 py-3 text-sm font-medium outline-none min-h-[100px] resize-none" placeholder="Brief description..." />
              </div>
              <div>
                <label className="text-sm font-bold mb-1.5 block">Priority</label>
                <div className="flex gap-3">
                  {(["low", "medium", "high"] as const).map((p) => (
                    <button key={p} className={`clay-button px-4 py-2 text-sm capitalize ${priorityColors[p]}`}>{p}</button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowCreateModal(false)} className="clay-button bg-muted text-foreground flex-1 py-3 font-bold">Cancel</button>
                <button className="clay-button bg-primary text-primary-foreground flex-1 py-3 font-bold">Create Project</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
