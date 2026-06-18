import { NextRequest, NextResponse } from "next/server";
import { Debate } from "@/lib/types";
import { callGemini } from "@/lib/gemini";
import { callGrok } from "@/lib/grok";
import { buildTurnPrompt, makeMessage, recomputeAnalytics } from "@/lib/debate-engine";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const debate = body.debate as Debate;

    if (!debate || typeof debate.topic !== "string") {
      return NextResponse.json(
        { error: "Некорректные данные спора." },
        { status: 400 }
      );
    }

    if (debate.status !== "in_progress") {
      return NextResponse.json({ debate });
    }

    if (debate.currentTurn >= debate.maxTurns) {
      return NextResponse.json({ debate });
    }

    const isGeminiTurn = debate.currentTurn % 2 === 0;
    const prompt = buildTurnPrompt(debate);

    if (isGeminiTurn) {
      const text = await callGemini(debate.personaGemini, prompt);
      const message = makeMessage("gemini", text);
      const updatedMessages = [...debate.messages, message];
      const analytics = recomputeAnalytics(updatedMessages);
      const newTurn = debate.currentTurn + 1;
      const status = newTurn >= debate.maxTurns ? "finished" : "in_progress";

      const updatedDebate: Debate = {
        ...debate,
        messages: updatedMessages,
        analytics,
        currentTurn: newTurn,
        status,
      };

      return NextResponse.json({ debate: updatedDebate });
    }

    // Ход Grok
    try {
      const text = await callGrok(debate.personaGrok, prompt);
      const message = makeMessage("grok", text);
      const updatedMessages = [...debate.messages, message];
      const analytics = recomputeAnalytics(updatedMessages);
      const newTurn = debate.currentTurn + 1;
      const status = newTurn >= debate.maxTurns ? "finished" : "in_progress";

      const updatedDebate: Debate = {
        ...debate,
        messages: updatedMessages,
        analytics,
        currentTurn: newTurn,
        status,
      };

      return NextResponse.json({ debate: updatedDebate });
    } catch (err) {
      console.error("Ошибка вызова Grok, переключаюсь на ручной режим:", err);
      const updatedDebate: Debate = {
        ...debate,
        status: "awaiting_manual_grok",
      };
      return NextResponse.json({
        debate: updatedDebate,
        warning:
          "Grok недоступен (нет ключа или ошибка API). Нужно ввести ответ вручную.",
      });
    }
  } catch (err) {
    console.error("Ошибка выполнения хода:", err);
    return NextResponse.json(
      { error: "Не удалось выполнить ход спора." },
      { status: 500 }
    );
  }
}
