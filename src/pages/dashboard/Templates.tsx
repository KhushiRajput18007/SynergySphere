import { FileText, Plus, Copy } from "lucide-react";

const templates = [
  { name: "Sprint Board", description: "Agile sprint planning with backlog and sprints", tasks: 12, category: "Agile" },
  { name: "Product Launch", description: "End-to-end product launch planning", tasks: 18, category: "Marketing" },
  { name: "Bug Tracker", description: "Track and manage software bugs efficiently", tasks: 8, category: "Engineering" },
  { name: "Content Calendar", description: "Plan and schedule content across channels", tasks: 15, category: "Content" },
  { name: "Client Onboarding", description: "Streamlined client onboarding process", tasks: 10, category: "Operations" },
  { name: "Design Sprint", description: "5-day design sprint framework", tasks: 20, category: "Design" },
];

const Templates = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">Templates</h1>
          <p className="text-muted-foreground font-medium">Start projects faster with pre-built templates</p>
        </div>
        <button className="clay-button bg-primary text-primary-foreground px-5 py-2.5 flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Create Template
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((t, i) => (
          <div key={i} className="clay-card p-6 group cursor-pointer">
            <div className="clay-card-inset w-12 h-12 flex items-center justify-center rounded-xl mb-4 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <span className="clay-badge bg-accent/10 text-accent px-2 py-0.5 text-xs mb-2 inline-block">{t.category}</span>
            <h3 className="text-lg font-bold mb-1">{t.name}</h3>
            <p className="text-sm text-muted-foreground font-medium mb-4">{t.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-bold">{t.tasks} tasks</span>
              <button className="clay-button bg-muted text-foreground px-3 py-1.5 text-xs flex items-center gap-1 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                <Copy className="w-3 h-3" /> Use Template
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Templates;
