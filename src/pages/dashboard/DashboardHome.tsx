import { BarChart3, FolderKanban, CheckSquare, Users, TrendingUp, Clock, ArrowUpRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const weeklyData = [
  { day: "Mon", tasks: 8, hours: 6 },
  { day: "Tue", tasks: 12, hours: 7 },
  { day: "Wed", tasks: 6, hours: 5 },
  { day: "Thu", tasks: 15, hours: 8 },
  { day: "Fri", tasks: 10, hours: 6 },
  { day: "Sat", tasks: 3, hours: 2 },
  { day: "Sun", tasks: 1, hours: 1 },
];

const recentActivities = [
  { user: "Ahmed", project: "Mobile App", action: "completed task", task: "Login UI", time: "2m ago" },
  { user: "Sara", project: "Website Redesign", action: "updated task", task: "Header Component", time: "15m ago" },
  { user: "Ali", project: "API Integration", action: "created task", task: "Auth Middleware", time: "1h ago" },
  { user: "Fatima", project: "Mobile App", action: "moved task to Done", task: "Splash Screen", time: "2h ago" },
  { user: "Hassan", project: "Dashboard", action: "added comment", task: "Analytics Chart", time: "3h ago" },
];

const DashboardHome = () => {
  const stats = [
    { icon: FolderKanban, label: "Active Projects", value: "4", change: "+2 this week", color: "text-primary" },
    { icon: CheckSquare, label: "Tasks Completed", value: "28", change: "+12 today", color: "text-accent" },
    { icon: Users, label: "Team Members", value: "16", change: "+3 this month", color: "text-secondary" },
    { icon: TrendingUp, label: "Productivity", value: "87%", change: "+5% vs last week", color: "text-info" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black">Good Morning! 👋</h1>
        <p className="text-muted-foreground font-medium">Here's what's happening with your projects today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="clay-card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="clay-card-inset w-11 h-11 flex items-center justify-center rounded-xl">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <ArrowUpRight className="w-4 h-4 text-accent" />
            </div>
            <div className="text-2xl font-black">{stat.value}</div>
            <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
            <div className="text-xs text-accent font-bold mt-1">{stat.change}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="clay-card p-6">
          <h3 className="font-bold mb-4">Weekly Task Activity</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "1rem",
                  boxShadow: "var(--clay-shadow-sm)",
                }}
              />
              <Bar dataKey="tasks" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="clay-card p-6">
          <h3 className="font-bold mb-4">Working Hours</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "1rem",
                  boxShadow: "var(--clay-shadow-sm)",
                }}
              />
              <Line type="monotone" dataKey="hours" stroke="hsl(var(--secondary))" strokeWidth={3} dot={{ fill: "hsl(var(--secondary))", r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="clay-card p-6">
        <h3 className="font-bold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {recentActivities.map((a, i) => (
            <div key={i} className="clay-card-inset p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="clay-card w-9 h-9 flex items-center justify-center rounded-full text-sm font-bold text-primary">
                  {a.user[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold">
                    <span className="font-bold">{a.user}</span> {a.action}{" "}
                    <span className="text-primary font-bold">"{a.task}"</span>
                  </p>
                  <p className="text-xs text-muted-foreground font-medium">{a.project}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                <Clock className="w-3 h-3" /> {a.time}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
