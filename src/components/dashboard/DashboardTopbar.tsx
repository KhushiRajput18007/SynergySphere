import { Bell, Search, User } from "lucide-react";
import { Link } from "react-router-dom";

const DashboardTopbar = () => {
  return (
    <header className="clay-nav mx-4 mt-4 mb-2 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <Search className="w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search projects, tasks, members..."
          className="bg-transparent outline-none text-sm font-medium w-full placeholder:text-muted-foreground"
        />
      </div>
      <div className="flex items-center gap-3">
        <Link to="/dashboard/notifications" className="clay-card-inset w-10 h-10 flex items-center justify-center rounded-xl relative hover:scale-105 transition-transform">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center font-bold">3</span>
        </Link>
        <Link to="/dashboard/profile" className="clay-card-inset w-10 h-10 flex items-center justify-center rounded-xl hover:scale-105 transition-transform">
          <User className="w-5 h-5 text-muted-foreground" />
        </Link>
      </div>
    </header>
  );
};

export default DashboardTopbar;
