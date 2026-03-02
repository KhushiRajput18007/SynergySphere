import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Button } from "../components/ui/button";
import ThemeToggle from "../components/ThemeToggle";
import { useState } from "react";
import { useAuth } from "../lib/store";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { BellRing, ShieldAlert, LogOut, Palette } from "lucide-react";

export default function Settings() {
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
          <p className="text-muted-foreground text-sm">Fine-tune your SynergySphere experience and preferences.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Appearance Section */}
          <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md">
            <CardHeader className="border-b bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-violet-100 text-violet-600 rounded-lg">
                  <Palette className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">Visual Style</CardTitle>
              </div>
              <CardDescription>Choose how SynergySphere looks on your device.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between p-4 rounded-xl border bg-muted/5">
                  <div className="space-y-1">
                    <div className="text-sm font-bold">Theme Mode</div>
                    <div className="text-xs text-muted-foreground leading-relaxed">Toggle between dark and light industrial modes.</div>
                  </div>
                  <ThemeToggle />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications Section */}
          <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md">
            <CardHeader className="border-b bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <BellRing className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">Communications</CardTitle>
              </div>
              <CardDescription>Stay informed about your projects and team activity.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl border bg-muted/5">
                <div className="space-y-0.5">
                  <Label className="text-sm font-bold cursor-pointer">Email Intelligence</Label>
                  <p className="text-xs text-muted-foreground">Receive periodic digests of team progress.</p>
                </div>
                <Switch checked={emailNotif} onCheckedChange={setEmailNotif} />
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl border bg-muted/5">
                <div className="space-y-0.5">
                  <Label className="text-sm font-bold cursor-pointer">Real-time Alerts</Label>
                  <p className="text-xs text-muted-foreground">Instant browser pings for urgent tasks.</p>
                </div>
                <Switch checked={pushNotif} onCheckedChange={setPushNotif} />
              </div>
            </CardContent>
          </Card>

          {/* Session Management */}
          <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md md:col-span-2">
            <CardHeader className="border-b bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">Account & Security</CardTitle>
              </div>
              <CardDescription>Control your active session and workspace access.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-center justify-between p-5 rounded-2xl border border-red-100 bg-red-50/10 gap-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg">
                    {user?.name?.[0].toUpperCase() ?? "G"}
                  </div>
                  <div>
                    <div className="font-bold tracking-tight">{user?.name ?? "Guest User"}</div>
                    <div className="text-xs text-muted-foreground">{user?.email ?? "workspace@synergysphere.io"}</div>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  className="font-bold h-11 px-6 rounded-xl hover:scale-105 transition-transform"
                  onClick={() => {
                    logout();
                    navigate("/#auth");
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" /> End Active Session
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
