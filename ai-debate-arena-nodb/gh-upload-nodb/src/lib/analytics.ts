const AGREEMENT_MARKERS = [
  "согла",
  "ты прав",
  "вы прав",
  "справедливо",
  "действительно, ты",
  "не могу не признать",
  "это действительно так",
  "признаю",
  "верно подмечено",
  "поддерживаю эту часть",
];

export function countWords(text: string): number {
  const matches = text.match(/[\p{L}\d]+/gu);
  return matches ? matches.length : 0;
}

export function countAgreementHits(text: string): number {
  const lower = text.toLowerCase();
  let hits = 0;
  for (const marker of AGREEMENT_MARKERS) {
    if (lower.includes(marker)) hits++;
  }
  return hits;
}
