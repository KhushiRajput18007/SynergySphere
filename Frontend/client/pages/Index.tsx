import Header from "../components/Header";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import Sidebar from "../components/Sidebar";
import ProjectCard from "../components/ProjectCard";
import Footer from "../components/Footer";
import AIInsightsCard from "../components/AIInsightsCard";
import CreateAccount from "../components/CreateAccount";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../components/ui/chart";
import { Bar, BarChart, CartesianGrid, Line, LineChart, Pie, PieChart, XAxis, YAxis } from "recharts";
import { useAuth, useStore } from "../lib/store";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const { user, register } = useAuth();
  const { selectors } = useStore();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const projects = useMemo(() => (user ? selectors.userProjects(user.id) : []), [selectors, user]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Hero / Intro when logged out */}
        {!user && (
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
            </div>
            <Card className="backdrop-blur">
              {isLogin ? (
                <Login onSwitchToRegister={() => setIsLogin(false)} />
              ) : (
                <CreateAccount
                  onRegister={register}
                  onSwitchToLogin={() => setIsLogin(true)}
                />
              )}
            </Card>
          </div>
        )}

        {/* Dashboard when logged in */}
        {user && (
          <div className="mx-auto grid max-w-7xl grid-cols-1 md:grid-cols-[256px_1fr] gap-6">
            <Sidebar />
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
                            <BarChart data={[{m:"Jan",v:20},{m:"Feb",v:35},{m:"Mar",v:45},{m:"Apr",v:60}]}>
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
                              <Pie dataKey="value" data={[{name:"Projects",value:40,fill:"#14b8a6"},{name:"Tasks",value:35,fill:"#0284c7"},{name:"Meetings",value:25,fill:"#64748b"}]} innerRadius={40} outerRadius={64} />
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
                            <LineChart data={[{m:"Mon",v:2},{m:"Tue",v:3},{m:"Wed",v:5},{m:"Thu",v:4},{m:"Fri",v:6}]}>
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
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

// You can also move this Login component to its own file (`Login.tsx`) for consistency
function Login({ onSwitchToRegister }: { onSwitchToRegister: () => void }) {
  const { login } = useAuth();
  const [values, setValues] = useState({ email: "", password: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(values.email, values.password);
  };

  return (
    <>
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={values.email} onChange={(e) => setValues({ ...values, email: e.target.value })} required placeholder="you@company.com" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={values.password} onChange={(e) => setValues({ ...values, password: e.target.value })} required placeholder="••••••••" />
          </div>
          <Button type="submit" className="w-full">Sign in</Button>
        </form>
        <div className="mt-3 flex items-center justify-between text-sm">
          <button className="text-primary underline underline-offset-4" onClick={onSwitchToRegister}>
            Need an account? Sign up
          </button>
          <button className="text-muted-foreground hover:text-foreground">Forgot password?</button>
        </div>
      </CardContent>
    </>
  );
}

function EmptyProjects() {
  return (
    <div className="rounded-lg border p-10 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-gradient-to-br from-violet-600 to-indigo-600 text-white">SS</div>
      <h3 className="text-lg font-semibold">Welcome to SynergySphere</h3>
      <p className="mt-1 text-sm text-muted-foreground">Create your first project to start assigning tasks, adding teammates, and discussing work in context.</p>
      <div className="mt-4 text-sm text-muted-foreground">Use the “New Project” button in the top bar to get started.</div>
    </div>
  );
}