// ============================================================
// SHŠ Heretik — Scéna · typo.js
// Česká mikrotypografie: nedělitelné mezery za jednopísmennými
// slovy (a i k o s u v z), před jednotkami a kolem pomlček.
// Funkce vrací řetězec s NBSP (U+00A0) — jinak beze změny.
// ============================================================

const NBSP = '\u00A0';

// Jednopísmenné české předložky a spojky (oba pády) — nesmí
// zůstat na konci řádku. \b vyloučí souhláskové shluky ("na").
const SINGLE_LETTER = /\b([aikousvzAIKOUSVZ])\s+(?=\S)/g;

// Jednotky — NBSP před jednotkou, ne za ní.
const UNITS = /\s+(%|Kč|kg|km|cm|mm|m²|°C)(?=\s|$|[.,;!?])/g;

// Pomlčky — NBSP na obou stranách (česká sazba).
const EM_DASH = /([^\s])\s*—\s*([^\s])/g;
const EN_DASH = /([^\s])\s*–\s*([^\s])/g;
const LEAD_DASH = /^—\s+/;

/**
 * cs(text) — vloží nedělitelné mezery podle českých typografických pravidel.
 * Vstupní text jinak vrací znak po znaku nezměněný.
 */
export function cs(text) {
  if (!text) return text;
  return String(text)
    .replace(SINGLE_LETTER, (m, letter) => letter + NBSP)
    .replace(UNITS, (m) => NBSP + m.trim())
    .replace(EM_DASH, (m, a, b) => `${a}${NBSP}—${NBSP}${b}`)
    .replace(EN_DASH, (m, a, b) => `${a}${NBSP}–${NBSP}${b}`)
    .replace(LEAD_DASH, (m) => `—${NBSP}`);
}
