import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Task, TaskStatus, useStore, idToInitials, User } from "../lib/store";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TaskCreateDialog from "../components/TaskCreateDialog";
import DashboardLayout from "../components/DashboardLayout";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Users, LayoutGrid, MessageSquare, Plus, UserPlus, CheckCircle2, Clock, ShieldCheck } from "lucide-react";
import { cn } from "../lib/utils";

export default function Project() {
  const { id } = useParams();
  const { selectors, dispatch, state } = useStore();
  const currentUser = selectors.currentUser();
  const project = id ? selectors.projectById(id) : null;
  const members = id ? selectors.projectMembers(id) : [];
  const navigate = useNavigate();
  const [createOpen, setCreateOpen] = useState(false);

  const isOwner = project?.ownerId === currentUser?.id || project?.managerId === currentUser?.id;

  const allTasks = useMemo(() => (id ? selectors.tasksByProject(id) : []), [selectors, id]);

  // Filter tasks: Members only see tasks assigned to them. Owner/Manager sees everything.
  const visibleTasks = useMemo(() => {
    if (isOwner) return allTasks;
    return allTasks.filter(t => t.assigneeId === currentUser?.id);
  }, [allTasks, isOwner, currentUser]);

  const grouped = useMemo(() => ({
    todo: visibleTasks.filter((t) => t.status === "todo"),
    inprogress: visibleTasks.filter((t) => t.status === "inprogress"),
    done: visibleTasks.filter((t) => t.status === "done"),
  }), [visibleTasks]);

  if (!project) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-muted-foreground font-medium">Project workspace not found.</p>
          <Button variant="link" onClick={() => navigate("/projects")}>Return to Portfolio</Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between bg-card/40 p-6 rounded-3xl border backdrop-blur-md shadow-xl">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge className="bg-primary/10 text-primary border-none text-[10px] font-bold uppercase tracking-widest px-3">Project Hub</Badge>
              {isOwner && <Badge className="bg-amber-100 text-amber-700 border-none text-[10px] font-bold uppercase tracking-widest px-3 flex gap-1"><ShieldCheck className="h-3 w-3" /> Admin</Badge>}
            </div>
            <h1 className="text-4xl font-black tracking-tight">{project.name}</h1>
            <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed">{project.description || "No project description provided."}</p>
          </div>
          <div className="flex items-center gap-3">
            <AddMemberDialog projectId={project.id} />
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild>
                <Button className="font-bold h-11 px-6 shadow-lg shadow-primary/20">
                  <Plus className="mr-2 h-4 w-4" /> Create Task
                </Button>
              </DialogTrigger>
              <TaskCreateDialog initialProjectId={project.id} onCreated={() => setCreateOpen(false)} />
            </Dialog>
          </div>
        </div>

        <Tabs defaultValue="board" className="w-full">
          <TabsList className="bg-muted/30 p-1 rounded-xl glass-morphism mb-6">
            <TabsTrigger value="board" className="px-8 py-2.5 font-bold text-xs uppercase tracking-tight gap-2 transition-all">
              <LayoutGrid className="h-4 w-4" /> Workflow
            </TabsTrigger>
            <TabsTrigger value="team" className="px-8 py-2.5 font-bold text-xs uppercase tracking-tight gap-2 transition-all">
              <Users className="h-4 w-4" /> Members
            </TabsTrigger>
            <TabsTrigger value="discuss" className="px-8 py-2.5 font-bold text-xs uppercase tracking-tight gap-2 transition-all">
              <MessageSquare className="h-4 w-4" /> Discussion
            </TabsTrigger>
          </TabsList>

          <TabsContent value="board" className="mt-0 outline-none">
            <div className="grid gap-6 md:grid-cols-3 items-start">
              <TaskColumn title="Backlog" tasks={grouped.todo} members={members} onUpdate={(id, patch) => dispatch({ type: "updateTask", payload: { id, patch } })} />
              <TaskColumn title="In Motion" tasks={grouped.inprogress} members={members} onUpdate={(id, patch) => dispatch({ type: "updateTask", payload: { id, patch } })} />
              <TaskColumn title="Resolved" tasks={grouped.done} members={members} onUpdate={(id, patch) => dispatch({ type: "updateTask", payload: { id, patch } })} />
            </div>
          </TabsContent>

          <TabsContent value="team" className="mt-0 outline-none">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {members.map(m => (
                <MemberCard key={m.id} member={m} tasks={allTasks.filter(t => t.assigneeId === m.id)} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="discuss" className="mt-0 outline-none">
            <Card className="border-none shadow-2xl bg-card/60 backdrop-blur-md overflow-hidden rounded-3xl">
              <CardHeader className="border-b bg-muted/20">
                <CardTitle className="text-lg">Project Stream</CardTitle>
                <CardDescription>Collaborate with your team members in real-time.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Discussion projectId={project.id} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

function TaskColumn({ title, tasks, members, onUpdate }: { title: string; tasks: Task[]; members: User[]; onUpdate: (id: string, patch: Partial<Task>) => void }) {
  return (
    <div className="rounded-2xl border bg-card/30 shadow-inner backdrop-blur-sm overflow-hidden flex flex-col min-h-[500px]">
      <div className="border-b p-4 flex items-center justify-between bg-muted/20">
        <span className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">{title}</span>
        <Badge variant="outline" className="text-[10px] opacity-60">{tasks.length}</Badge>
      </div>
      <div className="p-3 space-y-4 flex-1">
        {tasks.length === 0 && <div className="p-12 text-center text-xs text-muted-foreground/50 font-medium italic">Empty lane</div>}
        {tasks.map((t) => (
          <div key={t.id} className="p-5 space-y-4 rounded-2xl bg-background shadow-lg shadow-black/[0.02] border group hover:scale-[1.02] transition-all hover:border-primary/20">
            <div className="flex items-start justify-between gap-3">
              <h4 className="font-bold text-sm leading-tight group-hover:text-primary transition-colors">{t.title}</h4>
              <StatusSelect value={t.status} onChange={(v) => onUpdate(t.id, { status: v })} />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex -space-x-1.5 overflow-hidden">
                <Avatar className="h-6 w-6 ring-2 ring-background">
                  <AvatarFallback className="text-[8px] bg-primary/10 text-primary font-bold">
                    {t.assigneeId ? idToInitials(members.find(m => m.id === t.assigneeId)?.name || 'U') : '?'}
                  </AvatarFallback>
                </Avatar>
              </div>
              {t.dueDate && (
                <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase opacity-70">
                  <Clock className="h-3 w-3" />
                  {new Date(t.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MemberCard({ member, tasks }: { member: User; tasks: Task[] }) {
  const done = tasks.filter(t => t.status === 'done').length;
  return (
    <Card className="border-none shadow-xl bg-card/40 backdrop-blur-sm hover:scale-105 transition-transform overflow-hidden rounded-2xl">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 border-2 border-primary/10">
            <AvatarImage src={member.avatarDataUrl || ''} />
            <AvatarFallback className="text-lg font-black bg-muted">{idToInitials(member.name)}</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-bold tracking-tight">{member.name}</h4>
            <p className="text-xs text-muted-foreground capitalize font-medium">{member.role || 'Teammate'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="bg-muted/30 p-3 rounded-xl">
            <div className="text-[10px] font-black uppercase text-muted-foreground mb-1">Assigned</div>
            <div className="text-lg font-bold">{tasks.length}</div>
          </div>
          <div className="bg-green-50/30 p-3 rounded-xl">
            <div className="text-[10px] font-black uppercase text-green-600/70 mb-1">Resolved</div>
            <div className="text-lg font-bold text-green-700">{done}</div>
          </div>
        </div>

        {tasks.length > 0 && (
          <div className="space-y-2 pt-2">
            <div className="text-[10px] font-black uppercase opacity-40">Active Tasks</div>
            <div className="space-y-1.5">
              {tasks.slice(0, 2).map(t => (
                <div key={t.id} className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground">
                  <CheckCircle2 className={cn("h-3 w-3", t.status === 'done' ? "text-green-500" : "text-muted-foreground/30")} />
                  <span className="truncate">{t.title}</span>
                </div>
              ))}
              {tasks.length > 2 && <div className="text-[8px] font-black uppercase opacity-30">+{tasks.length - 2} more...</div>}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function StatusSelect({ value, onChange }: { value: TaskStatus; onChange: (v: TaskStatus) => void }) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as TaskStatus)}>
      <SelectTrigger className="h-7 w-[90px] text-[10px] font-bold uppercase border-none bg-muted/50 hover:bg-muted transition-colors">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="rounded-xl border-none shadow-2xl">
        <SelectItem value="todo">Pending</SelectItem>
        <SelectItem value="inprogress">Active</SelectItem>
        <SelectItem value="done">Done</SelectItem>
      </SelectContent>
    </Select>
  );
}

function Discussion({ projectId }: { projectId: string }) {
  const { selectors, dispatch, state } = useStore();
  const [message, setMessage] = useState("");
  const comments = selectors.commentsFor(projectId, null);
  const currentUser = state.currentUserId ? state.users[state.currentUserId] : null;

  const post = () => {
    if (!message.trim() || !currentUser) return;
    dispatch({ type: "addComment", payload: { projectId, taskId: null, authorId: currentUser.id, content: message.trim(), parentId: null } });
    setMessage("");
  };

  return (
    <div className="flex flex-col h-[600px]">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {comments.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-10 opacity-30 group cursor-default">
            <MessageSquare className="h-12 w-12 mb-4 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-bold uppercase tracking-widest">No pulse detected.</p>
            <p className="text-xs font-medium">Be the first to spark a conversation.</p>
          </div>
        )}
        {comments.map((c) => (
          <div key={c.id} className={cn(
            "flex gap-4",
            c.authorId === currentUser?.id ? "flex-row-reverse" : ""
          )}>
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback className="text-[10px] font-bold">{idToInitials(state.users[c.authorId]?.name || 'U')}</AvatarFallback>
            </Avatar>
            <div className={cn(
              "max-w-[70%] p-4 rounded-2xl shadow-sm space-y-1",
              c.authorId === currentUser?.id ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-muted/40 rounded-tl-none"
            )}>
              <div className="flex items-center justify-between gap-6">
                <div className="text-[10px] font-black uppercase opacity-60">{state.users[c.authorId]?.name}</div>
                <div className="text-[8px] font-bold opacity-40">{new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
              <div className="text-sm leading-relaxed whitespace-pre-wrap">{c.content}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t bg-muted/10 backdrop-blur-md">
        <div className="flex gap-2 max-w-4xl mx-auto items-center">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Broadcast a message..."
            className="bg-background border-none shadow-inner h-12 rounded-2xl px-5 focus-visible:ring-1"
            onKeyDown={(e) => e.key === 'Enter' && post()}
          />
          <Button onClick={post} className="rounded-2xl h-12 px-6 font-bold shadow-lg shadow-primary/20">Send</Button>
        </div>
      </div>
    </div>
  );
}

function AddMemberDialog({ projectId }: { projectId: string }) {
  const { addMemberAsync } = useStore();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const onAdd = async () => {
    if (!email.trim()) return;
    setIsLoading(true);
    try {
      await addMemberAsync(projectId, email.trim());
      setIsSuccess(true);
      setTimeout(() => {
        setOpen(false);
        setEmail("");
        setIsSuccess(false);
      }, 1500);
    } catch (err) {
      console.error("Failed to add member:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="font-bold h-11 border-muted-foreground/20 rounded-xl px-5 gap-2">
          <UserPlus className="h-4 w-4" /> Invite
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-3xl border-none shadow-2xl p-0 overflow-hidden">
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-8 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black tracking-tight flex items-center gap-3">
              <UserPlus className="h-7 w-7" /> Workspace Invite
            </DialogTitle>
            <CardDescription className="text-white/70 font-medium">Invite a collaborator to this project by email or user ID.</CardDescription>
          </DialogHeader>
        </div>
        <div className="p-8 space-y-6">
          <div className="space-y-3">
            <Label className="text-xs font-black uppercase tracking-widest opacity-60">Recipient Identity</Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="collaborator@synergysphere.io"
              disabled={isLoading || isSuccess}
              className="h-12 rounded-xl bg-muted/10 border-muted-foreground/20 focus-visible:ring-primary shadow-none"
            />
          </div>
          <div className="flex items-center gap-2 p-4 bg-amber-50 rounded-2xl border border-amber-100/50">
            <Clock className="h-5 w-5 text-amber-600 shrink-0" />
            <p className="text-[10px] text-amber-800 font-bold leading-relaxed">Invitations sent are PENDING until explicitly accepted by the recipient via their notification center.</p>
          </div>
          <Button
            onClick={onAdd}
            disabled={isLoading || isSuccess || !email.trim()}
            className={cn(
              "w-full h-12 rounded-xl font-bold text-lg transition-all",
              isSuccess ? "bg-green-500 hover:bg-green-600" : "shadow-lg shadow-primary/20"
            )}
          >
            {isLoading ? "Dispatching..." : isSuccess ? "Invitation Sent ✓" : "Send Formal Invite"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
