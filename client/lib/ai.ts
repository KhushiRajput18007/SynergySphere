import { State, Task, Project } from "../lib/store";

export type ProjectDraft = {
  name?: string;
  tags?: string[];
  managerId?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  priority?: "low" | "medium" | "high";
  imageDataUrl?: string | null;
  description?: string;
};

export type TaskDraft = {
  title?: string;
  description?: string;
  tags?: string[];
  priority?: "low" | "medium" | "high";
};

function clampDate(d: Date) {
  d.setHours(0, 0, 0, 0);
  return d;
}

function parsePriority(text: string): "low" | "medium" | "high" | undefined {
  const t = text.toLowerCase();
  if (/(high|urgent|critical|p1)/.test(t)) return "high";
  if (/(medium|normal|p2)/.test(t)) return "medium";
  if (/(low|later|p3)/.test(t)) return "low";
  return undefined;
}

export function generateProjectFromBrief(brief: string, state?: State): ProjectDraft {
  const nameMatch = brief.match(/(?:project|initiative|name)[:\-]\s*(.+)/i);
  const name = nameMatch ? nameMatch[1].trim() : brief.split(/[\n\.]/)[0]?.trim();

  const tags: string[] = [];
  const tagsMatch = brief.match(/tags?[:\-]\s*([^\n]+)/i);
  if (tagsMatch) tags.push(...tagsMatch[1].split(/[,#]/).map((t) => t.trim()).filter(Boolean));
  if (name) {
    const candidates = name.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
    tags.push(...candidates.slice(0, 3));
  }

  const pr = parsePriority(brief) || "medium";

  // Dates: look for numbers like 7d/14d/next week/next month
  let start: string | null = clampDate(new Date()).toISOString().slice(0, 10);
  let end: string | null = null;
  const daysMatch = brief.match(/(\d+)\s*(d|days)/i);
  if (daysMatch) {
    const days = parseInt(daysMatch[1], 10);
    const d = new Date();
    d.setDate(d.getDate() + days);
    end = clampDate(d).toISOString().slice(0, 10);
  } else if (/next\s+week/i.test(brief)) {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    end = clampDate(d).toISOString().slice(0, 10);
  } else if (/next\s+month/i.test(brief)) {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    end = clampDate(d).toISOString().slice(0, 10);
  }

  const description = brief.trim();

  return {
    name,
    tags: Array.from(new Set(tags)).slice(0, 6),
    startDate: start,
    endDate: end,
    priority: pr,
    description,
  };
}

export function generateTaskFromBrief(brief: string): TaskDraft {
  const title = brief.split(/[\n\.]/)[0]?.trim();
  const tags: string[] = [];
  const tagsMatch = brief.match(/tags?[:\-]\s*([^\n]+)/i);
  if (tagsMatch) tags.push(...tagsMatch[1].split(/[,#]/).map((t) => t.trim()).filter(Boolean));
  const pr = parsePriority(brief) || "medium";
  return {
    title,
    description: brief.trim(),
    tags: Array.from(new Set(tags)).slice(0, 6),
    priority: pr,
  };
}

export function summarizeNotifications(state: State, userId: string): string {
  const items = Object.values(state.notifications)
    .filter((n) => n.userId === userId)
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 10);
  if (items.length === 0) return "No recent notifications.";
  const groups: Record<string, number> = {};
  for (const n of items) {
    const k = n.category || "other";
    groups[k] = (groups[k] || 0) + 1;
  }
  const parts = Object.entries(groups).map(([k, v]) => `${v} ${k}`);
  const latest = items[0];
  return `You have ${items.length} recent alerts (${parts.join(", ")}). Latest: ${latest.message}`;
}
