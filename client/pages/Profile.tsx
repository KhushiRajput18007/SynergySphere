import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { idToInitials, useAuth, useStore } from "../lib/store";
import { useRef, useState } from "react";

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
      <div className="min-h-screen">
        <Header />
        <main className="mx-auto max-w-5xl px-4 py-8">Please sign in.</main>
      </div>
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
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Header />
      <div className="mx-auto grid max-w-7xl grid-cols-1 md:grid-cols-[256px_1fr] gap-6 px-4 py-6">
        <Sidebar />
        <main className="space-y-6">
          <Card className="backdrop-blur">
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-3 sm:grid-cols-[auto_1fr] sm:items-center">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    {avatar ? <AvatarImage src={avatar} alt={name} /> : <AvatarFallback>{idToInitials(name || user.name)}</AvatarFallback>}
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium">Profile Picture</div>
                    <div className="text-xs text-muted-foreground">Upload a new avatar or edit current</div>
                  </div>
                </div>
                <div className="sm:justify-self-start">
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onPick(e.target.files?.[0] || null)} />
                  <Button onClick={() => fileRef.current?.click()} className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:from-violet-500 hover:to-fuchsia-500">Change Photo</Button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Full Name</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label>Email Address</Label>
                  <Input value={email} readOnly />
                </div>
                <div className="grid gap-2">
                  <Label>Role</Label>
                  <Select value={role || "__none__"} onValueChange={(v) => setRole(v === "__none__" ? "" : v)}>
                    <SelectTrigger>
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
                  <Label>Department</Label>
                  <Input value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="Product Development" />
                </div>
              </div>

              <div className="grid gap-3">
                <div className="text-sm font-semibold">Security</div>
                <Dialog open={pwdOpen} onOpenChange={setPwdOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">Change Password</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Change Password</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-3">
                      <div className="grid gap-2">
                        <Label>New Password</Label>
                        <Input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} />
                      </div>
                      <div className="grid gap-2">
                        <Label>Confirm Password</Label>
                        <Input type="password" value={pwd2} onChange={(e) => setPwd2(e.target.value)} />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
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
                        Update Password
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="flex justify-end">
                <Button onClick={save} className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:from-violet-500 hover:to-fuchsia-500">Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
