import { useState, useRef, useEffect } from "react";
import { Send, Smile, Paperclip, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  user: string;
  content: string;
  time: string;
  isOwn: boolean;
}

const mockMessages: ChatMessage[] = [
  { id: "1", user: "Sara", content: "Hey team! How's the progress on the dashboard?", time: "10:30 AM", isOwn: false },
  { id: "2", user: "You", content: "Going well! I've completed the chart components.", time: "10:32 AM", isOwn: true },
  { id: "3", user: "Ali", content: "Nice! I'm working on the sidebar navigation. Should be done by EOD.", time: "10:35 AM", isOwn: false },
  { id: "4", user: "Fatima", content: "I need some help with the API integration. Can we have a quick sync?", time: "10:40 AM", isOwn: false },
  { id: "5", user: "You", content: "Sure! Let's do a 15-min call at 2 PM.", time: "10:42 AM", isOwn: true },
];

const Discussion = () => {
  const [messages, setMessages] = useState(mockMessages);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, {
      id: String(Date.now()),
      user: "You",
      content: input,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isOwn: true,
    }]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-black">Discussion</h1>
          <p className="text-sm text-muted-foreground font-medium">Mobile App Redesign • 5 members online</p>
        </div>
        <button className="clay-card-inset w-10 h-10 flex items-center justify-center rounded-xl">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((msg) => (
          <div key={msg.id} className={cn("flex", msg.isOwn ? "justify-end" : "justify-start")}>
            <div className="flex items-end gap-2 max-w-[75%]">
              {!msg.isOwn && (
                <div className="clay-card w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                  {msg.user[0]}
                </div>
              )}
              <div>
                {!msg.isOwn && <span className="text-xs font-bold text-primary mb-1 block">{msg.user}</span>}
                <div className={cn(
                  "p-3 rounded-2xl text-sm font-medium",
                  msg.isOwn ? "bg-primary text-primary-foreground rounded-br-sm" : "clay-card rounded-bl-sm"
                )}>
                  {msg.content}
                </div>
                <span className="text-xs text-muted-foreground mt-1 block">{msg.time}</span>
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="clay-card p-2 flex items-center gap-2">
        <button className="clay-card-inset w-10 h-10 flex items-center justify-center rounded-xl shrink-0">
          <Paperclip className="w-4 h-4 text-muted-foreground" />
        </button>
        <input
          type="text"
          placeholder="Type a message..."
          className="bg-transparent outline-none text-sm font-medium w-full px-2 py-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button className="clay-card-inset w-10 h-10 flex items-center justify-center rounded-xl shrink-0">
          <Smile className="w-4 h-4 text-muted-foreground" />
        </button>
        <button onClick={handleSend}
          className="clay-button bg-primary text-primary-foreground w-10 h-10 flex items-center justify-center shrink-0">
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Discussion;
