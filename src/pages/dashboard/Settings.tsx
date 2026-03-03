import { Save, Moon, Sun, Globe, Bell, Shield } from "lucide-react";

const Settings = () => {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-black">Settings</h1>
        <p className="text-muted-foreground font-medium">Customize your experience</p>
      </div>

      {/* Appearance */}
      <div className="clay-card p-6">
        <h3 className="font-bold mb-4 flex items-center gap-2"><Sun className="w-5 h-5 text-primary" /> Appearance</h3>
        <div className="flex gap-3">
          <button className="clay-button bg-primary text-primary-foreground px-4 py-2 text-sm flex items-center gap-2"><Sun className="w-4 h-4" /> Light</button>
          <button className="clay-button bg-muted text-foreground px-4 py-2 text-sm flex items-center gap-2"><Moon className="w-4 h-4" /> Dark</button>
        </div>
      </div>

      {/* Notifications */}
      <div className="clay-card p-6">
        <h3 className="font-bold mb-4 flex items-center gap-2"><Bell className="w-5 h-5 text-primary" /> Notifications</h3>
        <div className="space-y-4">
          {["Email Notifications", "Push Notifications", "Task Reminders", "Project Updates"].map((label) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-sm font-medium">{label}</span>
              <div className="clay-card-inset w-12 h-6 rounded-full flex items-center p-0.5 cursor-pointer">
                <div className="w-5 h-5 rounded-full bg-primary shadow-md transition-transform translate-x-6" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Language */}
      <div className="clay-card p-6">
        <h3 className="font-bold mb-4 flex items-center gap-2"><Globe className="w-5 h-5 text-primary" /> Language</h3>
        <select className="clay-input px-4 py-3 text-sm font-medium outline-none w-full">
          <option>English</option>
          <option>Hindi</option>
          <option>Urdu</option>
        </select>
      </div>

      {/* Security */}
      <div className="clay-card p-6">
        <h3 className="font-bold mb-4 flex items-center gap-2"><Shield className="w-5 h-5 text-primary" /> Security</h3>
        <button className="clay-button bg-muted text-foreground px-4 py-2 text-sm font-bold">Change Password</button>
      </div>
    </div>
  );
};

export default Settings;
