import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useAuth, useStore } from "../lib/store";
import { UserPlus } from "lucide-react";

export default function InviteDialog() {
  const { user } = useAuth();
  const { selectors, dispatch } = useStore();
  const projects = user ? selectors.userProjects(user.id) : [];
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [projectId, setProjectId] = useState(projects[0]?.id || "");

  const invite = () => {
    if (!projectId || !email.trim()) return;
    dispatch({ type: "addMember", payload: { projectId, emailOrUserId: email.trim() } });
    setOpen(false);
    setEmail("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline"><UserPlus className="h-4 w-4" /> Invite Team Member</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="grid gap-2">
            <Label>Email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="teammate@company.com" />
          </div>
          <div className="grid gap-2">
            <Label>Project</Label>
            <select className="h-10 rounded-md border bg-background px-3" value={projectId} onChange={(e) => setProjectId(e.target.value)}>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={invite} disabled={!projectId}>Invite</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
