// src/app/utils/ids.ts
export function normalizeLemma(lemma: string) {
  return lemma
    .toLowerCase()
    .normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}
export function wordDocId(lemma: string) {
  return `en:word:${normalizeLemma(lemma)}`; // e.g., en:word:ingenious
}
