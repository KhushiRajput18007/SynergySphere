import { useEffect, useMemo, useState } from "react";
import { SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "../components/ui/sheet";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { cn } from "../lib/utils";
import { useStore } from "../lib/store";
import { Folder, Tag as TagIcon, User, Flag, CloudUpload, Plus, Sparkles, X, ListTodo, Calendar, AlertCircle, ClipboardList, Users } from "lucide-react";
import { generateTaskFromBrief } from "../lib/ai";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";

export default function TaskCreateDialog({ initialProjectId, onCreated }: { initialProjectId?: string; onCreated: () => void }) {
  const { state, selectors, createTaskAsync } = useStore();
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
  const [isLoading, setIsLoading] = useState(false);

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

  const create = async () => {
    if (!title.trim() || !projectId) return;
    setIsLoading(true);
    try {
      await createTaskAsync({
        projectId,
        title: title.trim(),
        description: description.trim(),
        assigneeId: assigneeId || null,
        status: "todo",
        tags,
        priority,
        imageDataUrl,
      });
      setTitle("");
      setDescription("");
      setAssigneeId("");
      setTags([]);
      setPriority("low");
      setImageDataUrl(null);
      onCreated();
    } catch (err) {
      console.error("Failed to create task:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SheetContent className="sm:max-w-2xl p-0 flex flex-col h-full bg-background border-l shadow-2xl">
      <SheetHeader className="p-6 border-b bg-muted/30">
        <div className="flex items-center gap-2 mb-1">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <ListTodo className="h-4 w-4 text-primary" />
          </div>
          <SheetTitle className="text-2xl font-bold">New Task</SheetTitle>
        </div>
        <SheetDescription>
          Organize your workflow by defining clear, actionable items.
        </SheetDescription>
      </SheetHeader>

      <ScrollArea className="flex-1 p-6">
        <div className="space-y-8 pb-8">
          {/* AI Briefing */}
          <section className="space-y-4 rounded-xl border-2 border-dashed border-violet-200 bg-violet-50/50 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-violet-700">
              <Sparkles className="h-4 w-4" />
              <span>AI Assistant: Generate from Brief</span>
            </div>
            <Textarea
              placeholder="e.g., 'Fix the login button bug on mobile, 2 days deadline, tags: ui, bug'..."
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              className="bg-background/80 border-violet-200 focus-visible:ring-violet-500 shadow-sm"
            />
            <Button
              variant="outline"
              size="sm"
              className="w-full font-medium border-violet-300 text-violet-700 hover:bg-violet-100"
              onClick={() => {
                const d = generateTaskFromBrief(brief);
                if (d.title) setTitle(d.title);
                if (d.description) setDescription(d.description);
                if (d.tags) setTags(d.tags);
                if (d.priority) setPriority(d.priority);
              }}
            >
              <Sparkles className="mr-2 h-3 w-3" /> Auto-Construct Task
            </Button>
          </section>

          {/* Core Info */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <ClipboardList className="h-4 w-4" /> Task Details
            </h3>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="task-name" className="text-sm font-medium">Task Title</Label>
                <Input
                  id="task-name"
                  placeholder="What needs to be done?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-11 text-base font-medium"
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-sm font-medium">Context & Instructions</Label>
                <Textarea
                  placeholder="Provide more detail for the assignee..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[120px] resize-none"
                />
              </div>
            </div>
          </section>

          <Separator />

          {/* Assignments */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" /> Ownership & Project
            </h3>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label className="text-sm font-medium">Assign To</Label>
                <Select value={assigneeId || "__unassigned__"} onValueChange={(v) => setAssigneeId(v === "__unassigned__" ? "" : v)}>
                  <SelectTrigger className="h-10 bg-muted/20">
                    <User className="mr-2 h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__unassigned__">Unassigned</SelectItem>
                    {members.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        <div className="flex items-center gap-2">
                          <div className="h-5 w-5 rounded-full bg-violet-100 flex items-center justify-center text-[10px] font-bold text-violet-700">
                            {m.name.charAt(0)}
                          </div>
                          {m.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label className="text-sm font-medium">Target Project</Label>
                <Select value={projectId} onValueChange={setProjectId}>
                  <SelectTrigger className="h-10 bg-muted/20">
                    <Folder className="mr-2 h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    {userProjects.map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          <Separator />

          {/* Urgency & categorization */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <AlertCircle className="h-4 w-4" /> Priority & Tags
            </h3>
            <div className="grid gap-2">
              <Label className="text-sm font-medium">Urgency Level</Label>
              <RadioGroup value={priority} onValueChange={(v) => setPriority(v as any)} className="flex gap-2">
                {["low", "medium", "high"].map((p) => (
                  <Label
                    key={p}
                    className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 p-3 text-sm font-semibold capitalize transition-all ${priority === p
                      ? p === "high" ? "border-red-500 bg-red-50 text-red-700" :
                        p === "medium" ? "border-amber-500 bg-amber-50 text-amber-700" :
                          "border-green-500 bg-green-50 text-green-700"
                      : "border-muted bg-muted/30 text-muted-foreground hover:bg-muted/50"
                      }`}
                  >
                    <RadioGroupItem value={p} className="sr-only" />
                    {p}
                  </Label>
                ))}
              </RadioGroup>
            </div>

            <div className="grid gap-2">
              <Label className="text-sm font-medium">Tags</Label>
              <div className="flex flex-wrap items-center gap-2 rounded-xl border border-dashed p-3 bg-muted/10 min-h-[44px]">
                {tags.map((t) => (
                  <Badge key={t} variant="secondary" className="px-3 py-1 bg-violet-100 text-violet-700 border-none flex items-center gap-1.5 animate-in slide-in-from-left-2">
                    {t}
                    <X className="h-3 w-3 cursor-pointer hover:text-red-500" onClick={() => onRemoveTag(t)} />
                  </Badge>
                ))}
                <input
                  className="flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-muted-foreground"
                  placeholder="New tag..."
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
          </section>

          <Separator />

          {/* Attachments */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <CloudUpload className="h-4 w-4" /> Attachments
            </h3>
            <label className={cn(
              "relative grid h-40 cursor-pointer place-items-center rounded-2xl border-2 border-dashed border-muted transition-all hover:border-primary/50 hover:bg-primary/5 overflow-hidden",
            )}>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => onFileChange(e.target.files?.[0] || null)} />
              {imageDataUrl ? (
                <img src={imageDataUrl} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <div className="text-center space-y-2">
                  <CloudUpload className="mx-auto h-8 w-8 text-muted-foreground" />
                  <div className="text-sm font-medium text-muted-foreground">Drop reference image here</div>
                  <div className="text-xs text-muted-foreground/60">Upload screenshots or designs (up to 10MB)</div>
                </div>
              )}
            </label>
          </section>
        </div>
      </ScrollArea>

      <SheetFooter className="p-6 border-t bg-muted/30 flex-row gap-3">
        <Button variant="ghost" onClick={() => onCreated()} className="flex-1 h-12">Cancel</Button>
        <Button
          onClick={create}
          disabled={!title.trim() || !projectId || isLoading}
          className="flex-[2] h-12 font-bold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-lg shadow-indigo-500/20"
        >
          {isLoading ? <Plus className="mr-2 h-4 w-4 animate-spin" /> : "Dispatch Task"}
        </Button>
      </SheetFooter>
    </SheetContent>
  );
}
