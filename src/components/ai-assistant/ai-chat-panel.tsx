"use client";

import * as React from "react";
import { Mic, Send, Sparkles, Volume2, VolumeX } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { sendAssistantMessage } from "@/lib/actions/ai-assistant-chat";
import { createSpeechRecognizer, isSpeechRecognitionSupported } from "@/lib/voice/speech-recognition";
import { useVoiceMode } from "@/lib/voice/use-voice-mode";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  isError?: boolean;
};

let messageId = 0;
function nextId() {
  messageId += 1;
  return `msg-${messageId}`;
}

const LOCALE_TO_BCP47: Record<string, string> = {
  ru: "ru-RU",
  en: "en-US",
  uk: "uk-UA",
};

export function AiChatPanel({ className }: { className?: string }) {
  const t = useTranslations("aiAssistant.chat");
  const suggestions = t.raw("suggestions") as string[];
  const locale = useLocale();
  const bcp47Lang = LOCALE_TO_BCP47[locale] ?? "en-US";

  const [messages, setMessages] = React.useState<ChatMessage[]>(() => [
    { id: nextId(), role: "assistant", content: t("seedMessage") },
  ]);
  const [input, setInput] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);
  const [isListening, setIsListening] = React.useState(false);
  const listRef = React.useRef<HTMLDivElement>(null);
  const recognizerRef = React.useRef<ReturnType<typeof createSpeechRecognizer> | null>(null);

  const voice = useVoiceMode(bcp47Lang);
  const speechSupported = React.useMemo(() => isSpeechRecognitionSupported(), []);

  React.useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  React.useEffect(() => {
    return () => {
      recognizerRef.current?.stop();
    };
  }, []);

  function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    voice.stopSpeaking();

    const userMessage: ChatMessage = { id: nextId(), role: "user", content: trimmed };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setIsTyping(true);

    const apiHistory = nextMessages.map((m) => ({ role: m.role, content: m.content }));

    sendAssistantMessage(apiHistory)
      .then((response) => {
        if (response.ok) {
          setMessages((prev) => [...prev, { id: nextId(), role: "assistant", content: response.data.reply }]);
          voice.speak(response.data.reply);
        } else {
          const errorText = t.has(`errors.${response.errorCode}`)
            ? t(`errors.${response.errorCode}`)
            : t("errors.generic");
          setMessages((prev) => [...prev, { id: nextId(), role: "assistant", content: errorText, isError: true }]);
        }
      })
      .catch(() => {
        setMessages((prev) => [
          ...prev,
          { id: nextId(), role: "assistant", content: t("errors.generic"), isError: true },
        ]);
      })
      .finally(() => setIsTyping(false));
  }

  function toggleMic() {
    if (!speechSupported) return;

    if (isListening) {
      recognizerRef.current?.stop();
      return;
    }

    const recognizer = createSpeechRecognizer({
      lang: bcp47Lang,
      onResult: (transcript) => setInput(transcript),
      onEnd: () => {
        setIsListening(false);
        recognizerRef.current = null;
      },
      onError: () => {
        setIsListening(false);
        recognizerRef.current = null;
      },
    });
    if (!recognizer) return;

    recognizerRef.current = recognizer;
    setIsListening(true);
    recognizer.start();
  }

  return (
    <div className={cn("flex h-full min-h-0 flex-col", className)}>
      <div className="flex shrink-0 items-center justify-between gap-2 border-b px-4 py-2 sm:px-6">
        <div className="flex items-center gap-2">
          <Switch
            id="voice-mode"
            size="sm"
            checked={voice.enabled}
            onCheckedChange={voice.setEnabled}
            disabled={!voice.ttsSupported}
          />
          <label htmlFor="voice-mode" className="text-muted-foreground text-xs font-medium">
            {t("voiceModeLabel")}
          </label>
        </div>
        {voice.enabled && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={voice.muted ? t("unmuteLabel") : t("muteLabel")}
            aria-pressed={voice.muted}
            onClick={() => voice.setMuted(!voice.muted)}
          >
            {voice.muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
          </Button>
        )}
      </div>

      <div ref={listRef} className="flex-1 min-h-0 space-y-5 overflow-y-auto px-4 py-5 sm:px-6">
        {messages.map((message) => (
          <ChatBubble key={message.id} message={message} />
        ))}
        {isTyping && <TypingBubble />}
      </div>

      <div className="space-y-3 border-t bg-gradient-to-b from-transparent to-muted/30 p-3 sm:p-4">
        {suggestions.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setInput(suggestion)}
                className="hover:border-primary/50 hover:bg-primary/8 hover:text-foreground hover:shadow-[0_0_0_1px_color-mix(in_oklch,var(--primary)_35%,transparent),0_6px_18px_-8px_color-mix(in_oklch,var(--primary)_45%,transparent)] dark:hover:shadow-[0_0_0_1px_color-mix(in_oklch,var(--chart-1)_40%,transparent),0_0_18px_-4px_color-mix(in_oklch,var(--chart-3)_45%,transparent)] text-muted-foreground rounded-full border px-3 py-1 text-xs transition-all duration-300 hover:-translate-y-0.5"
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
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  type="button"
                  variant={isListening ? "default" : "outline"}
                  size="icon"
                  aria-pressed={isListening}
                  aria-label={t("voiceLabel")}
                  onClick={toggleMic}
                  disabled={!speechSupported}
                  className={cn("shrink-0", isListening && "ring-4 ring-primary/20")}
                >
                  <Mic className={cn("size-4", isListening && "animate-pulse")} />
                </Button>
              }
            />
            {!speechSupported && <TooltipContent>{t("micUnsupported")}</TooltipContent>}
          </Tooltip>
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
            className="min-h-9 resize-none rounded-2xl py-2 shadow-none"
          />
          <Button
            type="submit"
            size="icon"
            aria-label={t("sendLabel")}
            disabled={!input.trim() || isTyping}
            className="shrink-0"
          >
            <Send className="size-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}

function ChatBubble({ message }: { message: ChatMessage }) {
  const isAssistant = message.role === "assistant";
  return (
    <div
      className={cn(
        "animate-in fade-in-0 slide-in-from-bottom-3 flex items-end gap-2 duration-500 ease-out",
        !isAssistant && "flex-row-reverse",
      )}
    >
      {isAssistant && (
        <div className="from-primary to-primary/60 flex size-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-primary-foreground shadow-[0_2px_8px_-1px_color-mix(in_oklch,var(--primary)_60%,transparent)]">
          <Sparkles className="size-3.5" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed break-words whitespace-pre-wrap shadow-sm",
          isAssistant
            ? message.isError
              ? "bg-destructive/10 text-destructive rounded-bl-sm"
              : "bg-muted text-foreground rounded-bl-sm"
            : "bg-primary text-primary-foreground rounded-br-sm shadow-[0_4px_16px_-4px_color-mix(in_oklch,var(--primary)_55%,transparent)]",
        )}
      >
        {message.content}
      </div>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="animate-in fade-in-0 slide-in-from-bottom-2 flex items-end gap-2 duration-300">
      <div className="from-primary to-primary/60 flex size-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-primary-foreground">
        <Sparkles className="size-3.5" />
      </div>
      <div className="bg-muted flex items-center gap-1 rounded-2xl rounded-bl-sm px-3.5 py-3 shadow-sm">
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
