import { Debate, DebateAnalytics, DebateMessage } from "./types";
import { countAgreementHits, countWords } from "./analytics";

export function buildTurnPrompt(debate: Debate): string {
  let ctx = `Тема спора: ${debate.topic}\n\n`;
  if (debate.messages.length === 0) {
    ctx += "Спор только начинается. Открой его первым, изложи свою позицию.";
    return ctx;
  }

  ctx += "История спора:\n";
  for (const msg of debate.messages) {
    const label = msg.speaker === "gemini" ? "Оппонент A" : "Оппонент B";
    ctx += `${label}: ${msg.text}\n`;
  }
  ctx +=
    "\nТеперь твой ход. Ответь оппоненту, продвигая свою позицию, оспорь его последний аргумент если есть с чем поспорить. Будь краток (2-4 предложения), не повторяйся, не пересказывай то, что уже сказал ранее.";
  return ctx;
}

export function makeMessage(
  speaker: "gemini" | "grok",
  text: string
): DebateMessage {
  return {
    speaker,
    text,
    wordCount: countWords(text),
    agreementHits: countAgreementHits(text),
  };
}

export function recomputeAnalytics(messages: DebateMessage[]): DebateAnalytics {
  const analytics: DebateAnalytics = {
    wordsGemini: 0,
    wordsGrok: 0,
    agreementsGemini: 0,
    agreementsGrok: 0,
  };
  for (const msg of messages) {
    if (msg.speaker === "gemini") {
      analytics.wordsGemini += msg.wordCount;
      analytics.agreementsGemini += msg.agreementHits;
    } else {
      analytics.wordsGrok += msg.wordCount;
      analytics.agreementsGrok += msg.agreementHits;
    }
  }
  return analytics;
}
