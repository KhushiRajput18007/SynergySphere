import { useMemo, useState } from "react";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { useStore } from "../lib/store";
import { CalendarDays, CloudUpload, Tag as TagIcon, User, Target, Users, ClipboardList, LifeBuoy, Sparkles } from "lucide-react";
import { generateProjectFromBrief } from "../lib/ai";

export default function ProjectCreateDialog({ onCreated }: { onCreated: () => void }) {
  const { state, selectors, dispatch } = useStore();
  const currentUser = selectors.currentUser();
  const [name, setName] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [managerId, setManagerId] = useState<string>(currentUser?.id || "");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("low");
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [brief, setBrief] = useState("");

  const users = useMemo(() => Object.values(state.users), [state.users]);

  const onAddTag = (value: string) => {
    const v = value.trim();
    if (!v) return;
    if (!tags.includes(v)) setTags([...tags, v]);
  };

  const onFileChange = (file: File | null) => {
    if (!file) {
      setImageDataUrl(null);
      return;
    }
    if (!file.type.startsWith("image/") || file.size > 10 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onload = () => setImageDataUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const save = () => {
    if (!name.trim()) return;
    dispatch({
      type: "createProject",
      payload: {
        name: name.trim(),
        description: description.trim() || undefined,
        tags,
        managerId: managerId || null,
        startDate: startDate || null,
        endDate: endDate || null,
        priority,
        imageDataUrl,
      },
    });
    setName("");
    setTags([]);
    setManagerId(currentUser?.id || "");
    setStartDate("");
    setEndDate("");
    setPriority("low");
    setImageDataUrl(null);
    setDescription("");
    onCreated();
  };

  return (
    <DialogContent className="max-w-3xl rounded-2xl shadow-2xl">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold">Create Project</DialogTitle>
        <DialogDescription>SynergySphere</DialogDescription>
      </DialogHeader>

      <div className="grid gap-6 sm:grid-cols-[1fr_260px]">
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label>Project Name</Label>
            <div className="relative">
              <Input placeholder="Enter project name..." value={name} onChange={(e) => setName(e.target.value)} className="pl-9" />
              <TagIcon className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
            <div className="grid gap-2">
              <Label className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> AI: Generate from brief</Label>
              <div className="flex gap-2">
                <Textarea placeholder="e.g., Project: Website Redesign\nTags: ui, marketing\nHigh priority, 30 days timeline" value={brief} onChange={(e) => setBrief(e.target.value)} />
              </div>
              <div>
                <button
                  className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium hover:bg-accent"
                  onClick={() => {
                    const d = generateProjectFromBrief(brief, state);
                    if (d.name) setName(d.name);
                    if (d.tags) setTags(d.tags);
                    if (d.startDate) setStartDate(d.startDate);
                    if (d.endDate) setEndDate(d.endDate);
                    if (d.priority) setPriority(d.priority);
                    if (d.description) setDescription(d.description);
                  }}
                >
                  <Sparkles className="h-4 w-4" /> Generate
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap items-center gap-2 rounded-md border bg-background p-2">
              {tags.map((t) => (
                <Badge key={t} variant="secondary" className="flex items-center gap-1">
                  {t}
                  <button className="ml-1 text-muted-foreground hover:text-foreground" onClick={() => setTags(tags.filter((x) => x !== t))} aria-label={`remove ${t}`}>
                    ×
                  </button>
                </Badge>
              ))}
              <input
                className="flex-1 bg-transparent px-2 py-1 text-sm outline-none placeholder:text-muted-foreground"
                placeholder="Add tags..."
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    onAddTag((e.target as HTMLInputElement).value);
                    (e.target as HTMLInputElement).value = "";
                  }
                }}
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Project Manager</Label>
              <Select value={managerId || "__none__"} onValueChange={(v) => setManagerId(v === "__none__" ? "" : v)}>
                <SelectTrigger className="pl-9">
                  <User className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <SelectValue placeholder="Select Project Manager" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">Unassigned</SelectItem>
                  {users.map((u) => (
                    <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="relative">
                <Label>Start Date</Label>
                <Input type="date" placeholder="mm/dd/yyyy" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="pl-9" />
                <CalendarDays className="pointer-events-none absolute left-2 bottom-2.5 h-4 w-4 text-muted-foreground" />
              </div>
              <div className="relative">
                <Label>End Date</Label>
                <Input type="date" placeholder="mm/dd/yyyy" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="pl-9" />
                <CalendarDays className="pointer-events-none absolute left-2 bottom-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Priority Level</Label>
            <RadioGroup value={priority} onValueChange={(v) => setPriority(v as any)} className="flex gap-3">
              <div className="flex items-center gap-2 rounded-full border px-3 py-1.5">
                <RadioGroupItem value="low" id="plow" />
                <Label htmlFor="plow" className="cursor-pointer text-sm">Low</Label>
              </div>
              <div className="flex items-center gap-2 rounded-full border px-3 py-1.5">
                <RadioGroupItem value="medium" id="pmed" />
                <Label htmlFor="pmed" className="cursor-pointer text-sm">Medium</Label>
              </div>
              <div className="flex items-center gap-2 rounded-full border px-3 py-1.5">
                <RadioGroupItem value="high" id="phigh" />
                <Label htmlFor="phigh" className="cursor-pointer text-sm">High</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid gap-2">
            <Label>Project Image</Label>
            <label className="relative grid cursor-pointer place-items-center rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground hover:bg-accent/30">
              <input type="file" accept="image/*" className="hidden" onChange={(e) => onFileChange(e.target.files?.[0] || null)} />
              {imageDataUrl ? (
                <img src={imageDataUrl} alt="Preview" className="max-h-40 rounded-md object-contain" />
              ) : (
                <div>
                  <CloudUpload className="mx-auto h-6 w-6" />
                  <div>Drag & drop an image <span className="underline">browse</span></div>
                </div>
              )}
            </label>
          </div>

          <div className="grid gap-2">
            <Label>Description</Label>
            <Textarea placeholder="Describe your project goals and requirements..." value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
        </div>

        <aside className="hidden sm:block space-y-3">
          <div className="text-sm font-semibold">Best Practices</div>
          <div className="space-y-2">
            <Tip icon={<Target className="h-4 w-4" />} title="Define Clear Objectives" text="Set realistic, measurable goals that align with your business strategy." />
            <Tip icon={<Users className="h-4 w-4" />} title="Assign Right Team" text="Choose team members with complementary skills and experience." />
            <Tip icon={<CalendarDays className="h-4 w-4" />} title="Set Realistic Timeline" text="Allocate time for risks and dependencies to avoid surprises." />
            <Tip icon={<ClipboardList className="h-4 w-4" />} title="Track Progress" text="Hold check-ins and regular reviews to ensure milestones advance." />
            <Tip icon={<LifeBuoy className="h-4 w-4" />} title="Need Help?" text="Check our project management guide." />
          </div>
        </aside>
      </div>

      <DialogFooter className="mt-2">
        <DialogClose asChild>
          <Button variant="ghost">Cancel</Button>
        </DialogClose>
        <Button onClick={save} disabled={!name.trim()} className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:from-violet-500 hover:to-fuchsia-500">Save Project</Button>
      </DialogFooter>
    </DialogContent>
  );
}

function Tip({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-lg border bg-card p-3 text-sm">
      <div className="flex items-center gap-2 font-medium">
        {icon}
        {title}
      </div>
      <div className="mt-1 text-muted-foreground">{text}</div>
    </div>
  );
}
