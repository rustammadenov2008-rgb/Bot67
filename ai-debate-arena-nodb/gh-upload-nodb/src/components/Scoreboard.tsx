import { DebateAnalytics } from "@/lib/types";

interface ScoreboardProps {
  analytics: DebateAnalytics;
}

export function Scoreboard({ analytics }: ScoreboardProps) {
  const totalWords = analytics.wordsGemini + analytics.wordsGrok || 1;
  const geminiShare = Math.round((analytics.wordsGemini / totalWords) * 100);
  const grokShare = 100 - geminiShare;

  return (
    <div className="border border-line rounded-2xl bg-panel p-5">
      <p className="text-[11px] uppercase tracking-[0.18em] text-text-dim font-mono mb-4">
        Табло
      </p>

      <div className="space-y-4">
        <Stat
          label="Слов сказано"
          geminiValue={analytics.wordsGemini}
          grokValue={analytics.wordsGrok}
        />
        <Stat
          label="Признаков согласия"
          geminiValue={analytics.agreementsGemini}
          grokValue={analytics.agreementsGrok}
        />

        <div className="pt-2">
          <div className="flex justify-between text-[11px] font-mono text-text-dim mb-1.5">
            <span>Gemini {geminiShare}%</span>
            <span>Grok {grokShare}%</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden bg-panel-raised flex">
            <div
              className="bg-gemini h-full transition-all duration-500"
              style={{ width: `${geminiShare}%` }}
            />
            <div
              className="bg-grok h-full transition-all duration-500"
              style={{ width: `${grokShare}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  geminiValue,
  grokValue,
}: {
  label: string;
  geminiValue: number;
  grokValue: number;
}) {
  return (
    <div>
      <p className="text-xs text-text-dim mb-1.5">{label}</p>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-baseline gap-1.5">
          <span className="font-display text-xl font-bold text-gemini">
            {geminiValue}
          </span>
        </div>
        <div className="flex items-baseline gap-1.5 justify-end">
          <span className="font-display text-xl font-bold text-grok">
            {grokValue}
          </span>
        </div>
      </div>
    </div>
  );
}
