import Header from "../components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import ProjectCard from "../components/ProjectCard";
import Footer from "../components/Footer";
import AIInsightsCard from "../components/AIInsightsCard";
import LandingPage from "../components/LandingPage";
import Login from "../components/auth/Login";
import CreateAccount from "../components/auth/CreateAccount";
import ForgotPassword from "../components/auth/ForgotPassword";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../components/ui/chart";
import { Bar, BarChart, CartesianGrid, Line, LineChart, Pie, PieChart, XAxis, YAxis } from "recharts";
import { useAuth, useStore } from "../lib/store";
import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";

export default function Index() {
  const { user, register } = useAuth();
  const { selectors, fetchProjectsAsync } = useStore();
  const navigate = useNavigate();
  const [showLanding, setShowLanding] = useState(true);
  const [authView, setAuthView] = useState<'login' | 'register' | 'forgot'>('login');
  const projects = useMemo(() => (user ? selectors.userProjects(user.id) : []), [selectors, user]);

  // Handle auth mode from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    if (mode === 'signup') {
      setAuthView('register');
      setShowLanding(false);
    }
  }, []);

  // Fetch projects on mount/login
  useEffect(() => {
    if (user) {
      fetchProjectsAsync();
    }
  }, [user, fetchProjectsAsync]);

  // If user is not logged in and we want to show landing page
  if (!user && showLanding) {
    return (
      <div className="flex h-screen flex-col overflow-hidden bg-background">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <LandingPage />
          <Footer />
        </main>
      </div>
    );
  }

  // Dashboard when logged in
  if (user) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="text-2xl font-bold tracking-tight">Dashboard</div>
            </div>

            {projects.length === 0 ? (
              <EmptyProjects />
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {projects.slice(0, 3).map((p, idx) => (
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

                <div className="grid gap-4 md:grid-cols-3">
                  <AIInsightsCard />
                  <Card>
                    <CardHeader>
                      <CardTitle>Overall Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer config={{}} className="aspect-[16/9]">
                        <BarChart data={[{ m: "Jan", v: 20 }, { m: "Feb", v: 35 }, { m: "Mar", v: 45 }, { m: "Apr", v: 60 }]}>
                          <CartesianGrid vertical={false} strokeDasharray="3 3" />
                          <XAxis dataKey="m" tickLine={false} axisLine={false} />
                          <YAxis hide />
                          <Bar dataKey="v" fill="hsl(var(--primary))" radius={6} />
                        </BarChart>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Activity Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer config={{}} className="aspect-[16/9]">
                        <PieChart>
                          <Pie dataKey="value" data={[{ name: "Projects", value: 40, fill: "#14b8a6" }, { name: "Tasks", value: 35, fill: "#0284c7" }, { name: "Meetings", value: 25, fill: "#64748b" }]} innerRadius={40} outerRadius={64} />
                        </PieChart>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Progress & Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer config={{}} className="aspect-[16/9]">
                        <LineChart data={[{ m: "Mon", v: 2 }, { m: "Tue", v: 3 }, { m: "Wed", v: 5 }, { m: "Thu", v: 4 }, { m: "Fri", v: 6 }]}>
                          <CartesianGrid vertical={false} strokeDasharray="3 3" />
                          <XAxis dataKey="m" tickLine={false} axisLine={false} />
                          <YAxis hide />
                          <Line dataKey="v" type="monotone" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                          <ChartTooltip content={<ChartTooltipContent />} />
                        </LineChart>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <Header />
      <main className="flex-1 overflow-y-auto bg-gradient-to-b from-background to-muted/30 pb-16">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div id="auth" className="grid gap-8 md:grid-cols-2 items-center">
            <div>
              <span className="inline-flex items-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-3 py-1 text-xs font-medium text-white">New</span>
              <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight">SynergySphere – Advanced Team Collaboration</h1>
              <p className="mt-3 text-muted-foreground">
                Teams do their best work when tools support how they think and move forward together. Centralize projects, tasks, and conversations. Stay ahead with proactive insights and a clear view of progress.
              </p>
              <ul className="mt-4 grid gap-2 text-sm text-muted-foreground">
                <li>• Create projects, add members, assign tasks with due dates</li>
                <li>• Track status (To‑Do, In Progress, Done) with effortless updates</li>
                <li>• Threaded, project‑specific discussions keep context intact</li>
                <li>• Mobile‑ready and fast for on‑the‑go decisions</li>
              </ul>
              <div className="mt-6">
                <button
                  onClick={() => setShowLanding(true)}
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
                >
                  View Full Landing Page
                </button>
              </div>
            </div>
            <Card className="backdrop-blur">
              {authView === 'login' ? (
                <Login
                  onSwitchToRegister={() => setAuthView('register')}
                  onForgotPassword={() => setAuthView('forgot')}
                />
              ) : authView === 'register' ? (
                <CreateAccount
                  onRegister={register}
                  onSwitchToLogin={() => setAuthView('login')}
                />
              ) : (
                <ForgotPassword
                  onBackToLogin={() => setAuthView('login')}
                />
              )}
            </Card>
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
}

function EmptyProjects() {
  return (
    <div className="rounded-lg border p-10 text-center">
      <h3 className="text-lg font-bold">Welcome to SynergySphere</h3>
      <p className="mt-1 text-sm text-muted-foreground">Create your first project to start assigning tasks, adding teammates, and discussing work in context.</p>
      <div className="mt-4 text-sm text-muted-foreground">Use the "New Project" button in the top bar to get started.</div>
    </div>
  );
}
