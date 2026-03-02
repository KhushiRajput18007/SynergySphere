import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useAuth, useStore } from "../lib/store";
import { UserPlus, Mail, Folder, Check } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

export default function InviteDialog() {
  const { user } = useAuth();
  const { selectors, addMemberAsync } = useStore();
  const projects = user ? selectors.userProjects(user.id) : [];
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [projectId, setProjectId] = useState(projects[0]?.id || "");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const invite = async () => {
    if (!projectId || !email.trim()) return;
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
      console.error("Failed to invite:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="inline-flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm font-medium hover:bg-accent transition-colors shadow-sm">
          <UserPlus className="h-4 w-4" />
          <span className="hidden lg:inline">Invite Team Member</span>
          <span className="lg:hidden">Invite</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-2xl p-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="p-6 bg-gradient-to-br from-indigo-600 to-violet-700 text-white">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <UserPlus className="h-5 w-5 text-white" />
            </div>
            <DialogTitle className="text-2xl font-bold tracking-tight text-white">Expand Your Team</DialogTitle>
          </div>
          <DialogDescription className="text-indigo-100 text-sm">
            Collaboration is key. Invite a teammate to join your project workspace.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Email Address</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="teammate@company.com"
                  className="pl-10 h-11 border-muted-foreground/20 focus-visible:ring-indigo-500"
                  disabled={isLoading || isSuccess}
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="grid gap-2">
              <Label className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Select Project</Label>
              <Select
                value={projectId}
                onValueChange={setProjectId}
                disabled={isLoading || isSuccess}
              >
                <SelectTrigger className="h-11 border-muted-foreground/20 bg-muted/30">
                  <Folder className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Which project?" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 bg-muted/30 border-t">
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            disabled={isLoading || isSuccess}
          >
            Not now
          </Button>
          <Button
            onClick={invite}
            disabled={!projectId || !email.trim() || isLoading || isSuccess}
            className={`min-w-[120px] transition-all duration-300 ${isSuccess ? "bg-green-600 hover:bg-green-600" : "bg-indigo-600 hover:bg-indigo-700"
              }`}
          >
            {isLoading ? (
              <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : isSuccess ? (
              <Check className="h-4 w-4" />
            ) : (
              "Send Invite"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
