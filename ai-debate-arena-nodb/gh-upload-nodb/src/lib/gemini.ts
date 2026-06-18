// Имя модели задаётся через переменную окружения, чтобы не хардкодить
// версию, которая может устареть. Актуальные имена смотри в
// https://ai.google.dev/gemini-api/docs/models
export const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

export async function callGemini(
  systemPrompt: string,
  userContent: string,
  maxOutputTokens = 350
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY не задан. Добавь его в .env.local или в переменные окружения Vercel."
    );
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: systemPrompt }],
      },
      contents: [
        {
          role: "user",
          parts: [{ text: userContent }],
        },
      ],
      generationConfig: {
        maxOutputTokens,
      },
    }),
  });

  if (!response.ok) {
    const errBody = await response.text().catch(() => "");
    throw new Error(
      `Gemini API вернул ошибку ${response.status}: ${errBody.slice(0, 300)}`
    );
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (typeof text !== "string") {
    throw new Error("Gemini вернул ответ без текстового содержимого.");
  }
  return text.trim();
}
