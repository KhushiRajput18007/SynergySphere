import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { idToInitials, useAuth, useStore } from "../lib/store";
import { useRef, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";

export default function Profile() {
  const { user } = useAuth();
  const { dispatch } = useStore();
  const [name, setName] = useState(user?.name ?? "");
  const [email] = useState(user?.email ?? "");
  const [role, setRole] = useState(user?.role ?? "");
  const [department, setDepartment] = useState(user?.department ?? "");
  const [avatar, setAvatar] = useState<string | null>(user?.avatarDataUrl ?? null);
  const [pwdOpen, setPwdOpen] = useState(false);
  const [pwd, setPwd] = useState("");
  const [pwd2, setPwd2] = useState("");
  const fileRef = useRef<HTMLInputElement | null>(null);

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-muted-foreground font-medium">Please sign in to view your profile.</p>
        </div>
      </DashboardLayout>
    );
  }

  const save = () => {
    dispatch({ type: "updateUser", payload: { id: user.id, patch: { name, role, department, avatarDataUrl: avatar ?? null } } });
  };

  const onPick = (f: File | null) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) return;
    if (f.size > 10 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result as string);
    reader.readAsDataURL(f);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
          <p className="text-muted-foreground text-sm">Manage your personal information and security settings.</p>
        </div>

        <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md">
          <CardHeader className="border-b bg-muted/20">
            <CardTitle className="text-lg">Account Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-8 p-6">
            <div className="grid gap-4 sm:grid-cols-[auto_1fr] items-center">
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                  {avatar ? <AvatarImage src={avatar} alt={name} /> : <AvatarFallback className="text-xl font-bold">{idToInitials(name || user.name)}</AvatarFallback>}
                </Avatar>
                <div className="space-y-1">
                  <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Profile Image</div>
                  <div className="text-xs text-muted-foreground">PNG or JPG, max 10MB</div>
                  <div className="pt-2">
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onPick(e.target.files?.[0] || null)} />
                    <Button
                      size="sm"
                      onClick={() => fileRef.current?.click()}
                      className="bg-primary text-primary-foreground font-bold"
                    >
                      Choose New Image
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label className="text-xs font-bold uppercase tracking-tighter opacity-70">Display Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} className="bg-muted/10 border-muted-foreground/20" />
              </div>
              <div className="grid gap-2">
                <Label className="text-xs font-bold uppercase tracking-tighter opacity-70">Email Workspace</Label>
                <Input value={email} readOnly className="bg-muted/30 border-none cursor-not-allowed opacity-60" />
              </div>
              <div className="grid gap-2">
                <Label className="text-xs font-bold uppercase tracking-tighter opacity-70">Professional Role</Label>
                <Select value={role || "__none__"} onValueChange={(v) => setRole(v === "__none__" ? "" : v)}>
                  <SelectTrigger className="bg-muted/10 border-muted-foreground/20">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">Unspecified</SelectItem>
                    <SelectItem value="Senior Product Manager">Senior Product Manager</SelectItem>
                    <SelectItem value="Product Manager">Product Manager</SelectItem>
                    <SelectItem value="Engineer">Engineer</SelectItem>
                    <SelectItem value="Designer">Designer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label className="text-xs font-bold uppercase tracking-tighter opacity-70">Department</Label>
                <Input value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="e.g. Product Development" className="bg-muted/10 border-muted-foreground/20" />
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-sm font-bold tracking-tight">Login Security</div>
                  <p className="text-xs text-muted-foreground leading-relaxed">Regularly update your password to keep your workspace secure.</p>
                </div>
                <Dialog open={pwdOpen} onOpenChange={setPwdOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="font-bold border-muted-foreground/20">Change Password</Button>
                  </DialogTrigger>
                  <DialogContent className="rounded-2xl border-none shadow-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold tracking-tight">Security Update</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label className="text-xs font-bold uppercase opacity-70">New Secure Password</Label>
                        <Input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} className="bg-muted/10 border-muted-foreground/20" />
                      </div>
                      <div className="grid gap-2">
                        <Label className="text-xs font-bold uppercase opacity-70">Verify Password</Label>
                        <Input type="password" value={pwd2} onChange={(e) => setPwd2(e.target.value)} className="bg-muted/10 border-muted-foreground/20" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        className="w-full font-bold h-11"
                        onClick={() => {
                          if (pwd && pwd === pwd2) {
                            dispatch({ type: "updateUser", payload: { id: user.id, patch: { password: pwd } } });
                            setPwd("");
                            setPwd2("");
                            setPwdOpen(false);
                          }
                        }}
                        disabled={!pwd || pwd !== pwd2}
                      >
                        Commit Changes
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <Button onClick={save} className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold h-11 px-8 shadow-lg shadow-violet-500/20">Update All Details</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
