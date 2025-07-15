"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/Auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

type Click = { id: string; ip: string; userAgent: string; createdAt: string };
type LinkDetail = {
  id: string;
  slug: string;
  destination: string;
  summary?: string | null;
  createdAt: string;
  clicks: Click[];
};
type ChatMessage = { role: "user" | "assistant"; text: string };

export interface ChatDialogProps {
  link: LinkDetail;
  stats: Record<string, any>;
}

export default function ChatDialog({ link, stats }: ChatDialogProps) {
  const { user } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);
  const storageKey = `chat_history:${link.slug}`;

  // load from localStorage
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || "[]");
    } catch {
      return [];
    }
  });

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // scroll on new messages
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // persist history
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(messages));
  }, [messages, storageKey]);

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem(storageKey);
  };

  const send = async () => {
    const text = input.trim();
    if (!text) return;

    const userMsg: ChatMessage = { role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const { data } = await api.post<{ reply: string }>(
        `/urls/${link.slug}/chat`,
        { stats, history: [...messages, userMsg] },
      );
      setMessages((prev) => [...prev, { role: "assistant", text: data.reply }]);
    } catch (e: any) {
      toast.error(e.response?.data?.message ?? "Chat failed");
    } finally {
      setLoading(false);
    }
  };

  // choose a nicer title when slug="all-links"
  const title =
    link.slug === "all-links"
      ? "Ask UrlvyStatsBot about all your links"
      : `Ask UrlvyStatsBot about “${link.slug}”`;

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader className="flex justify-between items-center">
        <CardTitle>{title}</CardTitle>
        <Button size="sm" variant="ghost" onClick={clearChat}>
          Clear Chat
        </Button>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <ScrollArea
          className="h-80 rounded border p-4"
          style={{ overflowY: "auto" }}
        >
          <div ref={scrollRef} className="space-y-3">
            {!messages.length && !loading && (
              <p className="text-center text-muted-foreground text-sm">
                Type your question to get insights about performance.
              </p>
            )}

            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-4 py-2 rounded-lg max-w-[75%] break-words shadow-md ${
                    m.role === "user"
                      ? "bg-primary/20"
                      : "bg-muted/10 text-muted-foreground"
                  }`}
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {m.text}
                  </ReactMarkdown>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="px-4 py-2 rounded-lg bg-muted/10 shadow-md inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Thinking…
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex gap-2">
          <Input
            placeholder="Ask about trends, anomalies, suggestions…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
            disabled={loading || !user}
          />
          <Button onClick={send} disabled={loading || !user}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
