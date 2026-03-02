import { useMemo, useState } from "react";
import { SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "../components/ui/sheet";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { useStore } from "../lib/store";
import { CalendarDays, CloudUpload, Tag as TagIcon, User, Target, Users, ClipboardList, Sparkles, X, Layout, Clock, BarChart3 } from "lucide-react";
import { generateProjectFromBrief } from "../lib/ai";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";

export default function ProjectCreateDialog({ onCreated }: { onCreated: () => void }) {
  const { state, selectors, createProjectAsync } = useStore();
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
  const [isLoading, setIsLoading] = useState(false);

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

  const save = async () => {
    if (!name.trim()) return;
    setIsLoading(true);
    try {
      await createProjectAsync({
        name: name.trim(),
        description: description.trim() || undefined,
        tags,
        managerId: managerId || null,
        startDate: startDate || null,
        endDate: endDate || null,
        priority,
        imageDataUrl,
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
    } catch (err) {
      console.error("Failed to create project:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SheetContent className="sm:max-w-2xl p-0 flex flex-col h-full bg-background border-l shadow-2xl">
      <SheetHeader className="p-6 border-b bg-muted/30">
        <div className="flex items-center gap-2 mb-1">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Layout className="h-4 w-4 text-primary" />
          </div>
          <SheetTitle className="text-2xl font-bold">New Project</SheetTitle>
        </div>
        <SheetDescription>
          Plan, track, and manage your new initiative with SynergySphere.
        </SheetDescription>
      </SheetHeader>

      <ScrollArea className="flex-1 p-6">
        <div className="space-y-8 pb-8">
          {/* AI Generation Section */}
          <section className="space-y-4 rounded-xl border-2 border-dashed border-primary/20 bg-primary/5 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Sparkles className="h-4 w-4" />
              <span>AI Magic: Create from Brief</span>
            </div>
            <Textarea
              placeholder="Describe your project briefly (e.g., 'A marketing website redesign for Q3, high priority, with tags: web, ui')..."
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              className="bg-background/50 border-primary/10 focus-visible:ring-primary shadow-sm min-h-[100px]"
            />
            <Button
              variant="secondary"
              size="sm"
              className="w-full font-medium"
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
              <Sparkles className="mr-2 h-3 w-3" /> Generate with AI
            </Button>
          </section>

          {/* Basic Info */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <ClipboardList className="h-4 w-4" /> General Information
            </h3>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="project-name" className="text-sm font-medium">Project Name</Label>
                <Input
                  id="project-name"
                  placeholder="e.g. Website Redesign 2024"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-10"
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-sm font-medium">Description</Label>
                <Textarea
                  placeholder="What is this project about? (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[120px] resize-none"
                />
              </div>
            </div>
          </section>

          <Separator />

          {/* Details & Metadata */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" /> Timing & Assignment
            </h3>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label className="text-sm font-medium">Project Manager</Label>
                <Select value={managerId || "__none__"} onValueChange={(v) => setManagerId(v === "__none__" ? "" : v)}>
                  <SelectTrigger className="h-10 bg-muted/20">
                    <User className="mr-2 h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Select PM" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">Unassigned</SelectItem>
                    {users.map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        <div className="flex items-center gap-2">
                          <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold">
                            {u.name.charAt(0)}
                          </div>
                          {u.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label className="text-sm font-medium">Priority Level</Label>
                <RadioGroup value={priority} onValueChange={(v) => setPriority(v as any)} className="flex gap-2">
                  {["low", "medium", "high"].map((p) => (
                    <Label
                      key={p}
                      className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 p-2 text-xs font-semibold capitalize transition-all ${priority === p
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
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label className="text-sm font-medium">Start Date</Label>
                <div className="relative">
                  <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="pl-9 h-10" />
                  <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label className="text-sm font-medium">End Date</Label>
                <div className="relative">
                  <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="pl-9 h-10" />
                  <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>
          </section>

          <Separator />

          {/* Tags & Visuals */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <TagIcon className="h-4 w-4" /> Categorization
            </h3>
            <div className="grid gap-2">
              <Label className="text-sm font-medium">Tags</Label>
              <div className="flex flex-wrap items-center gap-2 rounded-xl border border-dashed p-3 bg-muted/10 min-h-[44px]">
                {tags.map((t) => (
                  <Badge key={t} variant="secondary" className="px-3 py-1 bg-primary/10 text-primary border-none flex items-center gap-1.5 animate-in zoom-in-95">
                    {t}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-red-500"
                      onClick={() => setTags(tags.filter((x) => x !== t))}
                    />
                  </Badge>
                ))}
                <input
                  className="flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-muted-foreground"
                  placeholder="Type tag and press Enter..."
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
              <Label className="text-sm font-medium">Cover Image</Label>
              <label className="group relative grid h-32 cursor-pointer place-items-center rounded-xl border-2 border-dashed border-muted transition-all hover:border-primary/50 hover:bg-muted/30 overflow-hidden">
                <input type="file" accept="image/*" className="hidden" onChange={(e) => onFileChange(e.target.files?.[0] || null)} />
                {imageDataUrl ? (
                  <>
                    <img src={imageDataUrl} alt="Preview" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold">
                      Click to Change
                    </div>
                  </>
                ) : (
                  <div className="text-center space-y-2">
                    <CloudUpload className="mx-auto h-8 w-8 text-muted-foreground group-hover:text-primary group-hover:scale-110 transition-transform" />
                    <div className="text-xs font-semibold text-muted-foreground">Upload project avatar (PNG/JPG)</div>
                  </div>
                )}
              </label>
            </div>
          </section>

          <Separator />

          {/* Best Practices Section (Condensed) */}
          <div className="rounded-xl bg-orange-50/50 border border-orange-100 p-4">
            <h4 className="text-xs font-bold text-orange-800 uppercase flex items-center gap-2 mb-2">
              <Target className="h-3 w-3" /> Quick Tips
            </h4>
            <div className="grid grid-cols-2 gap-3 text-[10px] text-orange-900/70 italic">
              <div className="flex items-center gap-1.5">• Define clear measurable goals</div>
              <div className="flex items-center gap-1.5">• Assign based on skills</div>
              <div className="flex items-center gap-1.5">• Set buffer for deadlines</div>
              <div className="flex items-center gap-1.5">• Hold weekly check-ins</div>
            </div>
          </div>
        </div>
      </ScrollArea>

      <SheetFooter className="p-6 border-t bg-muted/30 sm:flex-row gap-3">
        <Button variant="ghost" onClick={() => onCreated()} className="sm:flex-1 h-12">Cancel</Button>
        <Button
          onClick={save}
          disabled={!name.trim() || isLoading}
          className="sm:flex-[2] h-12 font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-indigo-500/20"
        >
          {isLoading ? <Clock className="mr-2 h-4 w-4 animate-spin" /> : "Bootstrap Project"}
        </Button>
      </SheetFooter>
    </SheetContent>
  );
}
