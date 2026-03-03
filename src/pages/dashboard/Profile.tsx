import { Camera, Save, Mail, User, MapPin, Briefcase } from "lucide-react";

const Profile = () => {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-black">Profile</h1>
        <p className="text-muted-foreground font-medium">Manage your personal information</p>
      </div>

      {/* Avatar */}
      <div className="clay-card p-6 flex items-center gap-6">
        <div className="relative">
          <div className="clay-card-inset w-24 h-24 rounded-full flex items-center justify-center text-3xl font-black gradient-text">
            AK
          </div>
          <button className="absolute bottom-0 right-0 clay-button bg-primary text-primary-foreground w-8 h-8 flex items-center justify-center rounded-full">
            <Camera className="w-4 h-4" />
          </button>
        </div>
        <div>
          <h2 className="text-xl font-bold">Ahmed Khan</h2>
          <p className="text-sm text-muted-foreground font-medium">Project Manager</p>
          <span className="clay-badge bg-primary/10 text-primary px-3 py-1 text-xs mt-2 inline-block">Pro Plan</span>
        </div>
      </div>

      {/* Info Form */}
      <div className="clay-card p-6 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-bold mb-1.5 block flex items-center gap-1"><User className="w-3.5 h-3.5" /> Full Name</label>
            <input type="text" className="clay-input w-full px-4 py-3 text-sm font-medium outline-none" defaultValue="Ahmed Khan" />
          </div>
          <div>
            <label className="text-sm font-bold mb-1.5 block flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> Email</label>
            <input type="email" className="clay-input w-full px-4 py-3 text-sm font-medium outline-none" defaultValue="ahmed@example.com" />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-bold mb-1.5 block flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> Role</label>
            <input type="text" className="clay-input w-full px-4 py-3 text-sm font-medium outline-none" defaultValue="Project Manager" />
          </div>
          <div>
            <label className="text-sm font-bold mb-1.5 block flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Location</label>
            <input type="text" className="clay-input w-full px-4 py-3 text-sm font-medium outline-none" defaultValue="Mumbai, India" />
          </div>
        </div>
        <div>
          <label className="text-sm font-bold mb-1.5 block">Bio</label>
          <textarea className="clay-input w-full px-4 py-3 text-sm font-medium outline-none min-h-[100px] resize-none" defaultValue="Passionate project manager with 5+ years of experience." />
        </div>
        <button className="clay-button bg-primary text-primary-foreground px-6 py-2.5 flex items-center gap-2 text-sm font-bold">
          <Save className="w-4 h-4" /> Save Changes
        </button>
      </div>
    </div>
  );
};

export default Profile;
