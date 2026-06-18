const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

// Имя модели задаётся через переменную окружения — список бесплатных
// моделей на OpenRouter меняется, актуальный смотри на
// https://openrouter.ai/models (фильтр Free). Суффикс :free обязателен,
// иначе при наличии баланса запрос станет платным.
export const GROK_MODEL =
  process.env.OPENROUTER_MODEL ?? "meta-llama/llama-3.3-70b-instruct:free";

export async function callGrok(
  systemPrompt: string,
  userContent: string,
  maxTokens = 350
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OPENROUTER_API_KEY не задан. Добавь его в .env.local или в переменные окружения Vercel."
    );
  }

  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      // Необязательные заголовки OpenRouter для их дашборда, на работу не влияют
      "HTTP-Referer": "https://bot67.vercel.app",
      "X-Title": "Debate Arena",
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
      `OpenRouter API вернул ошибку ${response.status}: ${errBody.slice(0, 300)}`
    );
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content;
  if (typeof text !== "string") {
    throw new Error("OpenRouter вернул ответ без текстового содержимого.");
  }
  return text.trim();
}
