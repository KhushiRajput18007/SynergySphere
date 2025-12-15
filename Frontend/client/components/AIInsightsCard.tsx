import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useMemo } from "react";
import { useStore } from "../lib/store";

export default function AIInsightsCard() {
  const { state, selectors } = useStore();
  const user = selectors.currentUser();
  const insights = useMemo(() => computeInsights(state, user?.id || null), [state, user?.id]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm">
          <li><strong>Upcoming:</strong> {insights.upcomingDue || "No due dates"}</li>
          <li><strong>Priorities:</strong> {insights.priorityBreakdown}</li>
          <li><strong>Suggestions:</strong> {insights.suggestion}</li>
        </ul>
      </CardContent>
    </Card>
  );
}

function computeInsights(state: any, userId: string | null) {
  const tasks = Object.values(state.tasks) as any[];
  const myTasks = userId ? tasks.filter((t) => t.assigneeId === userId) : tasks;
  const upcoming = myTasks
    .filter((t) => t.dueDate)
    .sort((a, b) => (a.dueDate! < b.dueDate! ? -1 : 1))[0];
  const counts = { low: 0, medium: 0, high: 0 } as Record<string, number>;
  for (const t of myTasks) {
    if (t.priority) counts[t.priority] = (counts[t.priority] || 0) + 1;
  }
  const priorityBreakdown = `High ${counts.high || 0}, Medium ${counts.medium || 0}, Low ${counts.low || 0}`;
  const upcomingDue = upcoming ? `${upcoming.title} (${upcoming.dueDate})` : "";
  const suggestion = counts.high > 0 ? "Tackle high priority tasks first." : "Plan next week’s tasks and add due dates.";
  return { upcomingDue, priorityBreakdown, suggestion };
}
