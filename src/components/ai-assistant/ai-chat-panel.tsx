"use client";

import * as React from "react";
import { Mic, Send, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

let messageId = 0;
function nextId() {
  messageId += 1;
  return `msg-${messageId}`;
}

export function AiChatPanel({ className }: { className?: string }) {
  const t = useTranslations("aiAssistant.chat");
  const suggestions = t.raw("suggestions") as string[];

  const [messages, setMessages] = React.useState<ChatMessage[]>(() => [
    { id: nextId(), role: "assistant", content: t("seedMessage") },
  ]);
  const [input, setInput] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);
  const [recording, setRecording] = React.useState(false);
  const listRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;
    setMessages((prev) => [...prev, { id: nextId(), role: "user", content: trimmed }]);
    setInput("");
    setIsTyping(true);
    window.setTimeout(
      () => {
        setMessages((prev) => [...prev, { id: nextId(), role: "assistant", content: t("previewReply") }]);
        setIsTyping(false);
      },
      1100 + Math.random() * 700,
    );
  }

  return (
    <div className={cn("flex h-full min-h-0 flex-col", className)}>
      <div ref={listRef} className="flex-1 min-h-0 space-y-4 overflow-y-auto p-4">
        {messages.map((message) => (
          <ChatBubble key={message.id} message={message} />
        ))}
        {isTyping && <TypingBubble />}
      </div>

      <div className="space-y-3 border-t p-3">
        {suggestions.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setInput(suggestion)}
                className="hover:border-primary/50 hover:bg-primary/5 hover:text-foreground text-muted-foreground rounded-full border px-3 py-1 text-xs transition-all duration-200 hover:-translate-y-0.5"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        <form
          onSubmit={(event) => {
            event.preventDefault();
            sendMessage(input);
          }}
          className="flex items-end gap-2"
        >
          <Button
            type="button"
            variant={recording ? "default" : "outline"}
            size="icon"
            aria-pressed={recording}
            aria-label={t("voiceLabel")}
            onClick={() => setRecording((value) => !value)}
            className={cn(recording && "ring-4 ring-primary/20")}
          >
            <Mic className={cn("size-4", recording && "animate-pulse")} />
          </Button>
          <Textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                sendMessage(input);
              }
            }}
            placeholder={t("inputPlaceholder")}
            rows={1}
            className="min-h-9 resize-none py-2"
          />
          <Button type="submit" size="icon" aria-label={t("sendLabel")} disabled={!input.trim() || isTyping}>
            <Send className="size-4" />
          </Button>
        </form>

        <p className="text-muted-foreground text-center text-[11px]">{t("previewNotice")}</p>
      </div>
    </div>
  );
}

function ChatBubble({ message }: { message: ChatMessage }) {
  const isAssistant = message.role === "assistant";
  return (
    <div className={cn("animate-in fade-in-0 slide-in-from-bottom-2 flex items-end gap-2 duration-300", !isAssistant && "flex-row-reverse")}>
      {isAssistant && (
        <div className="from-primary to-primary/60 flex size-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-white">
          <Sparkles className="size-3.5" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-3.5 py-2 text-sm",
          isAssistant
            ? "bg-muted text-foreground rounded-bl-sm"
            : "bg-primary text-primary-foreground rounded-br-sm",
        )}
      >
        {message.content}
      </div>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="animate-in fade-in-0 flex items-end gap-2 duration-300">
      <div className="from-primary to-primary/60 flex size-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-white">
        <Sparkles className="size-3.5" />
      </div>
      <div className="bg-muted flex items-center gap-1 rounded-2xl rounded-bl-sm px-3.5 py-3">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="bg-foreground/50 size-1.5 rounded-full"
            style={{ animation: "typing-dot 1.2s ease-in-out infinite", animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}
