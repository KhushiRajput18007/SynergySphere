import { useState } from "react";
import { Plus, Search, Mail, MoreVertical, Shield, User as UserIcon } from "lucide-react";

interface Member {
  id: string;
  name: string;
  email: string;
  role: "manager" | "member";
  projects: number;
  tasks: number;
  status: "active" | "pending";
}

const mockMembers: Member[] = [
  { id: "1", name: "Ahmed Khan", email: "ahmed@example.com", role: "manager", projects: 4, tasks: 12, status: "active" },
  { id: "2", name: "Sara Ali", email: "sara@example.com", role: "member", projects: 3, tasks: 8, status: "active" },
  { id: "3", name: "Ali Hassan", email: "ali@example.com", role: "member", projects: 2, tasks: 15, status: "active" },
  { id: "4", name: "Fatima Noor", email: "fatima@example.com", role: "member", projects: 1, tasks: 5, status: "pending" },
];

const Members = () => {
  const [search, setSearch] = useState("");
  const [showInvite, setShowInvite] = useState(false);

  const filtered = mockMembers.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">Members</h1>
          <p className="text-muted-foreground font-medium">Manage your team members</p>
        </div>
        <button onClick={() => setShowInvite(true)} className="clay-button bg-primary text-primary-foreground px-5 py-2.5 flex items-center gap-2 text-sm">
          <Mail className="w-4 h-4" /> Invite Member
        </button>
      </div>

      <div className="clay-card-inset p-1 flex items-center gap-2 max-w-md">
        <Search className="w-4 h-4 text-muted-foreground ml-3" />
        <input type="text" placeholder="Search members..." className="bg-transparent outline-none text-sm font-medium w-full py-2"
          value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="grid gap-4">
        {filtered.map((member) => (
          <div key={member.id} className="clay-card p-5 flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="clay-card-inset w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold gradient-text">
                {member.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold">{member.name}</h3>
                  {member.role === "manager" && (
                    <span className="clay-badge bg-primary/10 text-primary px-2 py-0.5 text-xs flex items-center gap-1">
                      <Shield className="w-3 h-3" /> Manager
                    </span>
                  )}
                  {member.status === "pending" && (
                    <span className="clay-badge bg-warning/20 text-warning px-2 py-0.5 text-xs">Pending</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground font-medium">{member.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center hidden sm:block">
                <div className="text-lg font-bold">{member.projects}</div>
                <div className="text-xs text-muted-foreground font-medium">Projects</div>
              </div>
              <div className="text-center hidden sm:block">
                <div className="text-lg font-bold">{member.tasks}</div>
                <div className="text-xs text-muted-foreground font-medium">Tasks</div>
              </div>
              <button className="clay-card-inset w-8 h-8 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Invite Modal */}
      {showInvite && (
        <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowInvite(false)}>
          <div className="clay-card p-8 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-black mb-6">Invite Team Member</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold mb-1.5 block">Email Address</label>
                <input type="email" className="clay-input w-full px-4 py-3 text-sm font-medium outline-none" placeholder="colleague@example.com" />
              </div>
              <div>
                <label className="text-sm font-bold mb-1.5 block">Role</label>
                <div className="flex gap-3">
                  <button className="clay-button bg-primary/10 text-primary px-4 py-2 text-sm flex items-center gap-1"><Shield className="w-3.5 h-3.5" /> Manager</button>
                  <button className="clay-button bg-muted text-foreground px-4 py-2 text-sm flex items-center gap-1"><UserIcon className="w-3.5 h-3.5" /> Member</button>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowInvite(false)} className="clay-button bg-muted text-foreground flex-1 py-3 font-bold">Cancel</button>
                <button className="clay-button bg-primary text-primary-foreground flex-1 py-3 font-bold">Send Invite</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;
