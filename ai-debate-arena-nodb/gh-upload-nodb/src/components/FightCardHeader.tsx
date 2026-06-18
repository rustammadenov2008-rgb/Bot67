interface FightCardHeaderProps {
  topic: string;
  personaGemini: string;
  personaGrok: string;
  activeSpeaker: "gemini" | "grok" | null;
}

export function FightCardHeader({
  topic,
  personaGemini,
  personaGrok,
  activeSpeaker,
}: FightCardHeaderProps) {
  return (
    <div className="border border-line rounded-2xl bg-panel overflow-hidden">
      <div className="px-5 py-3 border-b border-line">
        <p className="text-[11px] uppercase tracking-[0.18em] text-text-dim font-mono">
          Тема спора
        </p>
        <p className="font-display text-lg sm:text-xl font-medium mt-0.5">
          {topic}
        </p>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-stretch">
        <Corner
          name="Gemini"
          persona={personaGemini}
          accent="gemini"
          active={activeSpeaker === "gemini"}
          align="left"
        />
        <div className="flex items-center justify-center px-3 sm:px-6 bg-panel-raised">
          <span className="font-display text-2xl sm:text-3xl font-bold text-gold tracking-tight">
            VS
          </span>
        </div>
        <Corner
          name="Grok"
          persona={personaGrok}
          accent="grok"
          active={activeSpeaker === "grok"}
          align="right"
        />
      </div>
    </div>
  );
}

function Corner({
  name,
  persona,
  accent,
  active,
  align,
}: {
  name: string;
  persona: string;
  accent: "gemini" | "grok";
  active: boolean;
  align: "left" | "right";
}) {
  const accentColor = accent === "gemini" ? "text-gemini" : "text-grok";
  const dotColor = accent === "gemini" ? "bg-gemini" : "bg-grok";

  return (
    <div
      className={`px-4 sm:px-5 py-4 flex flex-col gap-1 ${
        align === "right" ? "items-end text-right" : "items-start text-left"
      }`}
    >
      <div className="flex items-center gap-2">
        {active && (
          <span
            className={`w-2 h-2 rounded-full ${dotColor} pulse-dot`}
            aria-hidden="true"
          />
        )}
        <span className={`font-display font-bold text-base sm:text-lg ${accentColor}`}>
          {name}
        </span>
      </div>
      <p className="text-xs text-text-dim leading-snug max-w-[220px] line-clamp-2">
        {persona}
      </p>
    </div>
  );
}
