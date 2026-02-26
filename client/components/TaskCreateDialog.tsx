import { useEffect, useMemo, useState } from "react";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { cn } from "../lib/utils";
import { useStore } from "../lib/store";
import { Folder, Tag as TagIcon, User, Flag, CloudUpload, Plus, Sparkles } from "lucide-react";
import { generateTaskFromBrief } from "../lib/ai";

export default function TaskCreateDialog({ initialProjectId, onCreated }: { initialProjectId?: string; onCreated: () => void }) {
  const { state, selectors, dispatch } = useStore();
  const user = selectors.currentUser();
  const userProjects = useMemo(() => (user ? selectors.userProjects(user.id) : []), [selectors, user]);

  const [projectId, setProjectId] = useState<string>(initialProjectId || userProjects[0]?.id || "");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assigneeId, setAssigneeId] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [priority, setPriority] = useState<"low" | "medium" | "high">("low");
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [brief, setBrief] = useState("");

  const members = useMemo(() => (projectId ? selectors.projectMembers(projectId) : []), [selectors, projectId]);

  useEffect(() => {
    // Reset assignee if not part of selected project
    if (assigneeId && !members.some((m) => m.id === assigneeId)) {
      setAssigneeId("");
    }
  }, [assigneeId, members]);

  const onAddTag = (value: string) => {
    const v = value.trim();
    if (!v) return;
    if (!tags.includes(v)) setTags([...tags, v]);
  };

  const onRemoveTag = (v: string) => setTags(tags.filter((t) => t !== v));

  const onFileChange = async (file: File | null) => {
    if (!file) {
      setImageDataUrl(null);
      return;
    }
    if (!file.type.startsWith("image/")) return;
    if (file.size > 10 * 1024 * 1024) return; // 10MB
    const reader = new FileReader();
    reader.onload = () => setImageDataUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const create = () => {
    if (!title.trim() || !projectId) return;
    dispatch({
      type: "createTask",
      payload: {
        projectId,
        title: title.trim(),
        description: description.trim(),
        assigneeId: assigneeId || null,
        dueDate: null,
        status: "todo",
        tags,
        priority,
        imageDataUrl,
      },
    });
    setTitle("");
    setDescription("");
    setAssigneeId("");
    setTags([]);
    setPriority("low");
    setImageDataUrl(null);
    onCreated();
  };

  return (
    <DialogContent className="max-w-xl rounded-2xl shadow-2xl">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold">Create Task</DialogTitle>
        <DialogDescription>Organize your work with SynergySphere</DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 py-2">
        <div className="grid gap-2">
          <Label htmlFor="task-name">Task Name</Label>
          <div className="relative">
            <Input id="task-name" placeholder="Enter task name..." value={title} onChange={(e) => setTitle(e.target.value)} className="pl-9" />
            <TagIcon className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label>Assignee</Label>
            <Select value={assigneeId || "__unassigned__"} onValueChange={(v) => setAssigneeId(v === "__unassigned__" ? "" : v)}>
              <SelectTrigger className="pl-9">
                <User className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <SelectValue placeholder="Select assignee..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__unassigned__">Unassigned</SelectItem>
                {members.map((m) => (
                  <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Project</Label>
            <Select value={projectId} onValueChange={setProjectId}>
              <SelectTrigger className="pl-9">
                <Folder className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <SelectValue placeholder="Select project..." />
              </SelectTrigger>
              <SelectContent>
                {userProjects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-2">
          <Label className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> AI: Generate from brief</Label>
          <Textarea placeholder="e.g., Create hero section for landing page, tags: ui, homepage, High priority" value={brief} onChange={(e) => setBrief(e.target.value)} />
          <div>
            <button
              className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium hover:bg-accent"
              onClick={() => {
                const d = generateTaskFromBrief(brief);
                if (d.title) setTitle(d.title);
                if (d.description) setDescription(d.description);
                if (d.tags) setTags(d.tags);
                if (d.priority) setPriority(d.priority);
              }}
            >
              <Sparkles className="h-4 w-4" /> Generate
            </button>
          </div>
        </div>

        <div className="grid gap-2">
          <Label>Tags</Label>
          <div className="flex flex-wrap items-center gap-2 rounded-md border bg-background p-2">
            {tags.map((t) => (
              <Badge key={t} variant="secondary" className="flex items-center gap-1">
                {t}
                <button className="ml-1 text-muted-foreground hover:text-foreground" onClick={() => onRemoveTag(t)} aria-label={`remove ${t}`}>
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

        <div className="grid gap-2">
          <Label>Priority</Label>
          <RadioGroup value={priority} onValueChange={(v) => setPriority(v as any)} className="flex gap-3">
            <div className="flex items-center gap-2 rounded-full border px-3 py-1.5">
              <RadioGroupItem value="low" id="p-low" />
              <Label htmlFor="p-low" className="cursor-pointer text-sm">Low</Label>
            </div>
            <div className="flex items-center gap-2 rounded-full border px-3 py-1.5">
              <RadioGroupItem value="medium" id="p-med" />
              <Label htmlFor="p-med" className="cursor-pointer text-sm">Medium</Label>
            </div>
            <div className="flex items-center gap-2 rounded-full border px-3 py-1.5">
              <RadioGroupItem value="high" id="p-high" />
              <Label htmlFor="p-high" className="cursor-pointer text-sm">High</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="grid gap-2">
          <Label>Upload Image</Label>
          <label className={cn(
            "relative grid cursor-pointer place-items-center rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground hover:bg-accent/30",
          )}>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => onFileChange(e.target.files?.[0] || null)} />
            {imageDataUrl ? (
              <img src={imageDataUrl} alt="Preview" className="max-h-40 rounded-md object-contain" />
            ) : (
              <div className="space-y-1">
                <CloudUpload className="mx-auto h-6 w-6" />
                <div>Click to upload or drag and drop</div>
                <div className="text-xs">PNG, JPG, up to 10MB</div>
              </div>
            )}
          </label>
        </div>

        <div className="grid gap-2">
          <Label>Description</Label>
          <Textarea placeholder="Describe the task details..." value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
      </div>

      <DialogFooter className="mt-2">
        <DialogClose asChild>
          <Button variant="ghost">Cancel</Button>
        </DialogClose>
        <Button onClick={create} disabled={!title.trim() || !projectId} className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:from-violet-500 hover:to-fuchsia-500">
          <Plus className="mr-2 h-4 w-4" /> Create Task
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
