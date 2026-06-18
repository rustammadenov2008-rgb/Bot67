const GROK_API_URL = "https://api.x.ai/v1/chat/completions";

// Имя модели задаётся через переменную окружения, чтобы не хардкодить
// версию, которая может устареть (xAI периодически переименовывает и
// перенаправляет старые слаги). Актуальные имена смотри в
// https://docs.x.ai/docs/models
export const GROK_MODEL = process.env.GROK_MODEL ?? "grok-4.3";

export async function callGrok(
  systemPrompt: string,
  userContent: string,
  maxTokens = 350
): Promise<string> {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "XAI_API_KEY не задан. Добавь его в .env.local или в переменные окружения Vercel."
    );
  }

  const response = await fetch(GROK_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROK_MODEL,
      max_tokens: maxTokens,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent },
      ],
    }),
  });

  if (!response.ok) {
    const errBody = await response.text().catch(() => "");
    throw new Error(
      `Grok API вернул ошибку ${response.status}: ${errBody.slice(0, 300)}`
    );
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content;
  if (typeof text !== "string") {
    throw new Error("Grok вернул ответ без текстового содержимого.");
  }
  return text.trim();
}
