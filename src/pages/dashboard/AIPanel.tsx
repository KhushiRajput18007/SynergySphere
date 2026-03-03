import { useState } from "react";
import { Brain, Send, Sparkles, Lightbulb, ListTodo, FolderKanban, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const suggestions = [
  { icon: ListTodo, label: "Plan tasks for my project", prompt: "Help me create a task plan for my current project" },
  { icon: FolderKanban, label: "Create a project", prompt: "Help me create a new project with detailed breakdown" },
  { icon: Lightbulb, label: "Suggest priorities", prompt: "Analyze my tasks and suggest priority levels" },
  { icon: Sparkles, label: "Optimize workflow", prompt: "Suggest workflow optimizations for my team" },
];

const AIPanel = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! I'm your AI project assistant. I can help you plan tasks, create projects with detailed breakdowns, and optimize your workflow. What would you like to do?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = (text?: string) => {
    const message = text || input;
    if (!message.trim()) return;

    setMessages(prev => [...prev, { role: "user", content: message }]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response (will connect to Lovable AI later)
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "I'll help you with that! This is a demo response. Once connected to the backend, I'll provide AI-powered task planning, project creation, and workflow optimization.\n\nHere's what I can do:\n- 📋 Break down projects into actionable tasks\n- ⚡ Suggest priority levels based on deadlines\n- 👥 Recommend task assignments based on team skills\n- 📊 Analyze productivity patterns"
      }]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      <div className="flex items-center gap-3 mb-4">
        <div className="clay-card-inset w-12 h-12 flex items-center justify-center rounded-xl">
          <Brain className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-black">AI Assistant</h1>
          <p className="text-sm text-muted-foreground font-medium">Powered by AI for smart project planning</p>
        </div>
        <span className="clay-badge bg-secondary/10 text-secondary px-3 py-1 text-xs ml-auto">Premium Feature</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((msg, i) => (
          <div key={i} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
            <div className={cn(
              "max-w-[80%] p-4 rounded-2xl text-sm font-medium whitespace-pre-line",
              msg.role === "user"
                ? "bg-primary text-primary-foreground rounded-br-sm"
                : "clay-card rounded-bl-sm"
            )}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="clay-card p-4 rounded-2xl rounded-bl-sm">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
            </div>
          </div>
        )}
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          {suggestions.map((s, i) => (
            <button key={i} onClick={() => handleSend(s.prompt)}
              className="clay-card p-4 text-left hover:scale-[1.02] transition-transform">
              <s.icon className="w-5 h-5 text-primary mb-2" />
              <span className="text-sm font-bold">{s.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="clay-card p-2 flex items-center gap-2">
        <input
          type="text"
          placeholder="Ask AI to help with your project..."
          className="bg-transparent outline-none text-sm font-medium w-full px-3 py-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={() => handleSend()}
          disabled={!input.trim() || isLoading}
          className="clay-button bg-primary text-primary-foreground w-10 h-10 flex items-center justify-center shrink-0 disabled:opacity-50">
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default AIPanel;
