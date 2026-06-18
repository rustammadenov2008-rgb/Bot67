export type Speaker = "gemini" | "grok";

export interface DebateMessage {
  speaker: Speaker;
  text: string;
  wordCount: number;
  agreementHits: number;
}

export interface DebateAnalytics {
  wordsGemini: number;
  wordsGrok: number;
  agreementsGemini: number;
  agreementsGrok: number;
}

export type DebateStatus = "in_progress" | "awaiting_manual_grok" | "finished";

export interface Debate {
  topic: string;
  personaGemini: string;
  personaGrok: string;
  totalRounds: number;
  currentTurn: number;
  maxTurns: number;
  status: DebateStatus;
  messages: DebateMessage[];
  analytics: DebateAnalytics;
}

export function emptyAnalytics(): DebateAnalytics {
  return {
    wordsGemini: 0,
    wordsGrok: 0,
    agreementsGemini: 0,
    agreementsGrok: 0,
  };
}
