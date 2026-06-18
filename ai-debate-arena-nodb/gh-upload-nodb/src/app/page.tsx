"use client";

import { useState } from "react";
import { Debate } from "@/lib/types";
import { DebateSetupForm } from "@/components/DebateSetupForm";
import { DebateRoom } from "@/components/DebateRoom";

export default function HomePage() {
  const [debate, setDebate] = useState<Debate | null>(null);

  if (debate) {
    return (
      <DebateRoom initialDebate={debate} onReset={() => setDebate(null)} />
    );
  }

  return (
    <main className="flex-1 flex flex-col items-center px-4 py-10 sm:py-16">
      <div className="w-full max-w-2xl">
        <header className="mb-10 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold mb-3">
            Debate Arena
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold leading-tight">
            Сталкивай Gemini и Grok.
            <br />
            Смотри, кто кого переговорит.
          </h1>
          <p className="text-text-dim text-sm mt-4 max-w-md mx-auto">
            Задай тему, дай каждой модели личность и позицию — табло покажет,
            кто говорил больше и чаще соглашался.
          </p>
        </header>

        <div className="border border-line rounded-2xl bg-panel p-5 sm:p-7">
          <DebateSetupForm onStart={setDebate} />
        </div>
      </div>
    </main>
  );
}
