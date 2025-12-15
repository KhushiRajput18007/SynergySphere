import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ThemeToggle from "../components/ThemeToggle";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Button } from "../components/ui/button";
import { useState } from "react";
import { useAuth } from "../lib/store";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Header />
      <div className="mx-auto grid max-w-7xl grid-cols-1 md:grid-cols-[256px_1fr] gap-6 px-4 py-6">
        <Sidebar />
        <main className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
            </CardHeader>
            <CardContent>
              <ThemeToggle />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between rounded-md border px-3 py-2">
                <Label>Email updates</Label>
                <Switch checked={emailNotif} onCheckedChange={setEmailNotif} />
              </div>
              <div className="flex items-center justify-between rounded-md border px-3 py-2">
                <Label>Push notifications</Label>
                <Switch checked={pushNotif} onCheckedChange={setPushNotif} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between rounded-md border px-3 py-3">
              <div className="text-sm">
                <div className="font-medium">{user?.name ?? "Guest"}</div>
                <div className="text-muted-foreground">{user?.email ?? "Not signed in"}</div>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  logout();
                  navigate("/#auth");
                }}
              >
                Logout
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
