"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Loader2, MessageSquareText, Sparkles, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/Auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

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
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const storageKey = `chat_history:${link.slug}`;
  const starterPrompts =
    link.slug === "all-links"
      ? [
          "Which links are driving the most engagement right now?",
          "Summarize the biggest traffic patterns in the last 30 days.",
          "What anomalies should I investigate first?",
        ]
      : [
          `Summarize how ${link.slug} is performing.`,
          "What does the hourly pattern suggest about audience behavior?",
          "Give me two actions to improve this link's performance.",
        ];

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey) || "[]");
      setMessages(Array.isArray(stored) ? stored : []);
    } catch {
      setMessages([]);
    }
  }, [storageKey]);

  // scroll on new messages
  useEffect(() => {
    const viewport = scrollAreaRef.current?.querySelector(
      '[data-slot="scroll-area-viewport"]',
    ) as HTMLDivElement | null;

    if (!viewport) return;
    viewport.scrollTo({
      top: viewport.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  // persist history
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(storageKey, JSON.stringify(messages));
  }, [messages, storageKey]);

  const clearChat = () => {
    setMessages([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem(storageKey);
    }
  };

  const send = async (rawText?: string) => {
    const text = (rawText ?? input).trim();
    if (!text) return;

    const userMsg: ChatMessage = { role: "user", text };
    const history = [...messages, userMsg];
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const { data } = await api.post<{ reply: string }>(
        `/urls/${link.slug}/chat`,
        { stats, history },
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
    <Card className="border-border/70 bg-card/94 py-0">
      <CardHeader className="flex flex-col gap-4 border-b border-border/70 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Badge variant="secondary" className="eyebrow">
            <Sparkles className="h-3.5 w-3.5" />
            AI analyst
          </Badge>
          <CardTitle className="text-xl">{title}</CardTitle>
          <p className="text-sm text-muted-foreground">
            Ask for trends, anomalies, recommendations, or a plain-language
            summary of the current stats.
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={clearChat}>
          <Trash2 className="h-4 w-4" />
          Clear chat
        </Button>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 pt-6">
        {!messages.length ? (
          <div className="flex flex-wrap gap-2">
            {starterPrompts.map((prompt) => (
              <Button
                key={prompt}
                type="button"
                variant="outline"
                size="sm"
                disabled={loading || !user}
                onClick={() => void send(prompt)}
              >
                {prompt}
              </Button>
            ))}
          </div>
        ) : null}

        <ScrollArea
          ref={scrollAreaRef}
          className="h-[24rem] rounded-[1.25rem] border border-border/70 bg-background/55 p-4"
        >
          <div className="space-y-3">
            {!messages.length && !loading && (
              <div className="flex h-full min-h-52 flex-col items-center justify-center gap-3 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
                  <MessageSquareText className="h-5 w-5" />
                </div>
                <p className="max-w-md text-sm text-muted-foreground">
                  Start a conversation to get a readable explanation of
                  performance trends, timing patterns, and optimization
                  opportunities.
                </p>
              </div>
            )}

            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 break-words shadow-sm ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "border border-border/60 bg-card text-muted-foreground"
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
                <div className="inline-flex items-center gap-2 rounded-2xl border border-border/60 bg-card px-4 py-3 shadow-sm">
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
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                void send();
              }
            }}
            disabled={loading || !user}
          />
          <Button onClick={() => void send()} disabled={loading || !user}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send"}
          </Button>
        </div>

        {!user ? (
          <p className="text-sm text-muted-foreground">
            Sign in to use the AI assistant for link insights.
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
