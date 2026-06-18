import { DebateMessage } from "@/lib/types";

interface MessageBubbleProps {
  message: DebateMessage;
  index: number;
}

export function MessageBubble({ message, index }: MessageBubbleProps) {
  const isGemini = message.speaker === "gemini";
  const accent = isGemini ? "gemini" : "grok";
  const label = isGemini ? "Gemini" : "Grok";

  return (
    <div
      className={`message-enter flex ${isGemini ? "justify-start" : "justify-end"}`}
    >
      <div
        className={`max-w-[85%] sm:max-w-[70%] rounded-2xl border px-4 py-3 ${
          isGemini
            ? "border-gemini-dim bg-panel rounded-tl-sm"
            : "border-grok-dim bg-panel rounded-tr-sm"
        }`}
      >
        <div
          className={`flex items-center gap-2 mb-1.5 ${
            isGemini ? "" : "justify-end"
          }`}
        >
          <span className="font-mono text-[10px] text-text-dim">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span
            className={`font-display text-xs font-bold ${
              accent === "gemini" ? "text-gemini" : "text-grok"
            }`}
          >
            {label}
          </span>
        </div>
        <p className="text-sm leading-relaxed text-text whitespace-pre-wrap">
          {message.text}
        </p>
      </div>
    </div>
  );
}
