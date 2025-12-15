import { Link, useLocation } from "react-router-dom";
import { cn } from "../lib/utils";
import ThemeToggle from "../components/ThemeToggle";
import { Home, FolderKanban, ListTodo, Users, BarChart3, Settings as Gear } from "lucide-react";

const items = [
  { to: "/", label: "Dashboard", icon: Home },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/tasks", label: "Tasks", icon: ListTodo },
  { to: "/team", label: "Team", icon: Users },
  { to: "/reports", label: "Reports", icon: BarChart3 },
];

export default function Sidebar() {
  const { pathname } = useLocation();
  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:gap-4 md:border-r md:bg-card/40 md:p-4 md:[position:sticky] md:top-16 md:h-[calc(100vh-64px)]">
      <div className="flex items-center gap-2 px-2">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-teal-600 text-white font-semibold">SS</span>
        <span className="font-semibold tracking-tight">SynergySphere</span>
      </div>
      <nav className="mt-2 space-y-1">
        {items.map((it) => {
          const Icon = it.icon;
          const active = pathname === it.to;
          return (
            <Link
              key={it.to}
              to={it.to}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent",
                active ? "bg-accent text-foreground" : "text-muted-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {it.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto space-y-3">
        <ThemeToggle />
        <Link
          to="/settings"
          className="flex items-center justify-between rounded-md border px-3 py-2 text-sm hover:bg-accent"
        >
          <span>Settings</span>
          <Gear className="h-4 w-4" />
        </Link>
      </div>
    </aside>
  );
}
