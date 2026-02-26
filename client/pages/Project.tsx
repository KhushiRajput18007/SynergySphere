import Header from "../components/Header";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Textarea } from "../components/ui/textarea";
import { Task, TaskStatus, useStore } from "../lib/store";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TaskCreateDialog from "../components/TaskCreateDialog";

export default function Project() {
  const { id } = useParams();
  const { selectors, dispatch, state } = useStore();
  const project = id ? selectors.projectById(id) : null;
  const members = id ? selectors.projectMembers(id) : [];
  const navigate = useNavigate();
  const [createOpen, setCreateOpen] = useState(false);

  const tasks = useMemo(() => (id ? selectors.tasksByProject(id) : []), [selectors, id]);
  const grouped = useMemo(() => ({
    todo: tasks.filter((t) => t.status === "todo"),
    inprogress: tasks.filter((t) => t.status === "inprogress"),
    done: tasks.filter((t) => t.status === "done"),
  }), [tasks]);

  if (!project) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="mx-auto max-w-5xl px-4 py-8">
          <p className="text-muted-foreground">Project not found.</p>
          <Button className="mt-4" variant="outline" onClick={() => navigate("/")}>Back to Dashboard</Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{project.name}</h1>
            <p className="text-sm text-muted-foreground">Plan, assign, and discuss work in one place.</p>
          </div>
          <div className="flex gap-2">
            <AddMemberDialog projectId={project.id} />
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild>
                <Button>Create Task</Button>
              </DialogTrigger>
              <TaskCreateDialog initialProjectId={project.id} onCreated={() => setCreateOpen(false)} />
            </Dialog>
          </div>
        </div>

        <Tabs defaultValue="board">
          <TabsList>
            <TabsTrigger value="board">Tasks</TabsTrigger>
            <TabsTrigger value="discuss">Discussions</TabsTrigger>
          </TabsList>
          <TabsContent value="board" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <TaskColumn title="To‑Do" tasks={grouped.todo} members={members} onUpdate={(id, patch) => dispatch({ type: "updateTask", payload: { id, patch } })} />
              <TaskColumn title="In Progress" tasks={grouped.inprogress} members={members} onUpdate={(id, patch) => dispatch({ type: "updateTask", payload: { id, patch } })} />
              <TaskColumn title="Done" tasks={grouped.done} members={members} onUpdate={(id, patch) => dispatch({ type: "updateTask", payload: { id, patch } })} />
            </div>
          </TabsContent>
          <TabsContent value="discuss">
            <Card>
              <CardHeader>
                <CardTitle>Project Discussion</CardTitle>
              </CardHeader>
              <CardContent>
                <Discussion projectId={project.id} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function TaskColumn({ title, tasks, members, onUpdate }: { title: string; tasks: Task[]; members: { id: string; name: string }[]; onUpdate: (id: string, patch: Partial<Task>) => void }) {
  return (
    <div className="rounded-lg border bg-card">
      <div className="border-b p-3 text-sm font-semibold">{title}</div>
      <div className="divide-y">
        {tasks.length === 0 && <div className="p-4 text-sm text-muted-foreground">No tasks</div>}
        {tasks.map((t) => (
          <div key={t.id} className="p-3 space-y-2">
            <div className="flex items-center justify-between gap-3">
              <div className="font-medium truncate">{t.title}</div>
              <StatusSelect value={t.status} onChange={(v) => onUpdate(t.id, { status: v })} />
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div>
                <div className="uppercase">Assignee</div>
                <MemberSelect members={members} value={t.assigneeId ?? ""} onChange={(v) => onUpdate(t.id, { assigneeId: v || null })} />
              </div>
              <div>
                <div className="uppercase">Due</div>
                <Input type="date" value={t.dueDate ?? ""} onChange={(e) => onUpdate(t.id, { dueDate: e.target.value || null })} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusSelect({ value, onChange }: { value: TaskStatus; onChange: (v: TaskStatus) => void }) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as TaskStatus)}>
      <SelectTrigger className="h-8 w-[140px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="todo">To‑Do</SelectItem>
        <SelectItem value="inprogress">In Progress</SelectItem>
        <SelectItem value="done">Done</SelectItem>
      </SelectContent>
    </Select>
  );
}

function MemberSelect({ members, value, onChange }: { members: { id: string; name: string }[]; value: string; onChange: (v: string) => void }) {
  return (
    <Select value={value || "__unassigned__"} onValueChange={(v) => onChange(v === "__unassigned__" ? "" : v)}>
      <SelectTrigger className="h-8 w-[140px]">
        <SelectValue placeholder="Unassigned" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="__unassigned__">Unassigned</SelectItem>
        {members.map((m) => (
          <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
        ))}
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
    <div className="space-y-4">
      <div className="space-y-3">
        {comments.length === 0 && <div className="text-sm text-muted-foreground">No messages yet. Start the conversation.</div>}
        {comments.map((c) => (
          <div key={c.id} className="rounded-lg border p-3">
            <div className="text-sm font-medium">{state.users[c.authorId]?.name ?? "Unknown"} <span className="ml-2 text-xs text-muted-foreground">{new Date(c.createdAt).toLocaleString()}</span></div>
            <div className="mt-1 text-sm">{c.content}</div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Write a message" />
        <Button onClick={post}>Send</Button>
      </div>
    </div>
  );
}

function AddMemberDialog({ projectId }: { projectId: string }) {
  const { state, dispatch } = useStore();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const onAdd = () => {
    const existing = Object.values(state.users).find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!existing && !name.trim()) return;
    if (!existing) {
      dispatch({ type: "createUser", payload: { name: name.trim(), email: email.trim() } });
      // created user will exist after reducer; find id again by email
    }
    const user = Object.values(state.users).find((u) => u.email.toLowerCase() === email.toLowerCase());
    const userId = user ? user.id : Object.values(state.users).find((u) => u.email.toLowerCase() === email.toLowerCase())?.id;
    if (userId) {
      dispatch({ type: "addMember", payload: { projectId, emailOrUserId: userId } });
      setOpen(false);
      setEmail("");
      setName("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Member</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add project member</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="grid gap-2">
            <Label>Email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="teammate@company.com" />
          </div>
          {!Object.values(state.users).some((u) => u.email.toLowerCase() === email.toLowerCase()) && (
            <div className="grid gap-2">
              <Label>Name (for new user)</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Teammate Name" />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={onAdd}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
