"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Debate } from "@/lib/types";
import { makeMessage, recomputeAnalytics } from "@/lib/debate-engine";
import { FightCardHeader } from "@/components/FightCardHeader";
import { MessageBubble } from "@/components/MessageBubble";
import { Scoreboard } from "@/components/Scoreboard";

interface DebateRoomProps {
  initialDebate: Debate;
  onReset: () => void;
}

export function DebateRoom({ initialDebate, onReset }: DebateRoomProps) {
  const [debate, setDebate] = useState<Debate>(initialDebate);
  const [manualText, setManualText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const runningRef = useRef(false);

  const activeSpeaker: "gemini" | "grok" | null =
    debate.status === "in_progress"
      ? debate.currentTurn % 2 === 0
        ? "gemini"
        : "grok"
      : null;

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [debate.messages.length]);

  const runTurn = useCallback(async () => {
    if (runningRef.current) return;
    runningRef.current = true;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/debate/turn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ debate }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Не удалось выполнить ход.");
      }
      setDebate(data.debate);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Что-то пошло не так.");
    } finally {
      runningRef.current = false;
      setBusy(false);
    }
  }, [debate]);

  // Автопрогон: пока статус in_progress, дёргаем следующий ход сам.
  useEffect(() => {
    if (debate.status !== "in_progress") return;
    const timeout = setTimeout(() => {
      runTurn();
    }, 700);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debate.status, debate.currentTurn]);

  function submitManual() {
    if (!manualText.trim()) return;
    const message = makeMessage("grok", manualText.trim());
    const updatedMessages = [...debate.messages, message];
    const analytics = recomputeAnalytics(updatedMessages);
    const newTurn = debate.currentTurn + 1;
    const status = newTurn >= debate.maxTurns ? "finished" : "in_progress";

    setDebate({
      ...debate,
      messages: updatedMessages,
      analytics,
      currentTurn: newTurn,
      status,
    });
    setManualText("");
  }

  return (
    <div className="flex-1 flex flex-col items-center px-4 py-8 sm:py-10">
      <div className="w-full max-w-3xl flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <button
            onClick={onReset}
            className="text-xs text-text-dim hover:text-text transition-colors font-mono"
          >
            ← новый спор
          </button>
        </div>

        <FightCardHeader
          topic={debate.topic}
          personaGemini={debate.personaGemini}
          personaGrok={debate.personaGrok}
          activeSpeaker={activeSpeaker}
        />

        <div className="grid sm:grid-cols-[1fr_260px] gap-5">
          <div className="flex flex-col gap-3 min-h-[200px]">
            {debate.messages.map((msg, i) => (
              <MessageBubble key={i} message={msg} index={i} />
            ))}

            {debate.status === "in_progress" && (
              <div className="flex items-center gap-2 text-xs text-text-dim font-mono px-1">
                <span
                  className={`w-1.5 h-1.5 rounded-full pulse-dot ${
                    activeSpeaker === "gemini" ? "bg-gemini" : "bg-grok"
                  }`}
                />
                {activeSpeaker === "gemini" ? "Gemini" : "Grok"} формулирует
                аргумент… раунд {Math.floor(debate.currentTurn / 2) + 1} из{" "}
                {debate.totalRounds}
              </div>
            )}

            {debate.status === "awaiting_manual_grok" && (
              <div className="border border-line rounded-2xl bg-panel p-4 flex flex-col gap-2">
                <p className="text-sm text-text-dim">
                  Grok недоступен (нет ключа xAI, нет баланса или сбой
                  запроса). Вставь ответ за Grok вручную — например,
                  скопировав его с grok.com на этот же запрос.
                </p>
                <textarea
                  value={manualText}
                  onChange={(e) => setManualText(e.target.value)}
                  rows={3}
                  className="w-full resize-none"
                  placeholder="Ответ Grok на последнюю реплику Gemini..."
                />
                <button
                  onClick={submitManual}
                  disabled={busy || !manualText.trim()}
                  className="self-start font-display font-bold text-sm bg-grok text-ink rounded-lg px-4 py-2 hover:brightness-110 transition disabled:opacity-50"
                >
                  Отправить за Grok
                </button>
              </div>
            )}

            {debate.status === "finished" && (
              <div className="self-center mt-2 text-xs text-text-dim font-mono px-3 py-2 border border-line rounded-full">
                Спор завершён — {debate.totalRounds} раундов сыграно
              </div>
            )}

            {error && (
              <p className="text-sm text-grok bg-grok-dim/20 border border-grok-dim rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <div ref={scrollRef} />
          </div>

          <div className="flex flex-col gap-4">
            <Scoreboard analytics={debate.analytics} />
          </div>
        </div>
      </div>
    </div>
  );
}
