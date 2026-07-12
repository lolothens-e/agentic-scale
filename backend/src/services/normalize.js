/**
 * Shape normalizado que consume `ingestService`:
 * {
 *   fuente: "FINNHUB" | "QUIVER",
 *   fuenteId: string,          // id estable en la fuente, para upsert idempotente
 *   titulo: string,
 *   resumen: string | null,
 *   url: string,
 *   fecha: Date,               // fecha del evento/noticia (no de la ingesta)
 *   tickers: [{ ticker: string, tipo: "ACCION"|"CRIPTOACTIVO"|"CREDITO"|"OTRO" }]
 * }
 */

const CRYPTO_HINTS = ["BTC", "ETH", "SOL", "DOGE", "XRP", "USDT", "USDC", "-USD"];
const CREDIT_HINTS = ["US10Y", "US2Y", "US30Y", "BOND", "YIELD"];

function inferTipo(rawTicker) {
  const t = (rawTicker || "").toUpperCase();
  if (CRYPTO_HINTS.some((hint) => t.includes(hint))) return "CRIPTOACTIVO";
  if (CREDIT_HINTS.some((hint) => t.includes(hint))) return "CREDITO";
  if (!t) return "OTRO";
  return "ACCION";
}

function parseRelatedTickers(related, fallbackTicker) {
  const raw = (related || fallbackTicker || "")
    .split(",")
    .map((t) => t.trim().toUpperCase())
    .filter(Boolean);

  const unique = [...new Set(raw)];
  return unique.map((ticker) => ({ ticker, tipo: inferTipo(ticker) }));
}

/** Normaliza un item crudo de Finnhub /company-news */
function normalizeFinnhubItem(raw) {
  if (!raw || !raw.id || !raw.headline || !raw.url) return null;

  return {
    fuente: "FINNHUB",
    fuenteId: String(raw.id),
    titulo: raw.headline,
    resumen: raw.summary || null,
    url: raw.url,
    fecha: new Date(raw.datetime * 1000), // Finnhub manda epoch en segundos
    tickers: parseRelatedTickers(raw.related, raw.__watchlistTicker),
  };
}

/** Normaliza un item crudo de Quiver /live/congresstrading */
function normalizeQuiverItem(raw) {
  if (!raw || !raw.Ticker || !raw.TransactionDate) return null;

  const fuenteId = [raw.Representative, raw.Ticker, raw.TransactionDate, raw.Transaction]
    .filter(Boolean)
    .join("|");

  const titulo = `${raw.Representative || "Miembro del Congreso"} reportó ${
    raw.Transaction || "una operación"
  } en ${raw.Ticker}`;

  const resumenPartes = [
    raw.Range ? `Rango: ${raw.Range}` : null,
    raw.House ? `Cámara: ${raw.House}` : null,
    raw.ReportDate ? `Reportado el ${raw.ReportDate}` : null,
  ].filter(Boolean);

  return {
    fuente: "QUIVER",
    fuenteId,
    titulo,
    resumen: resumenPartes.join(" · ") || null,
    // Quiver no siempre trae una URL de detalle pública; se linkea al dashboard.
    url: `https://www.quiverquant.com/congresstrading/${encodeURIComponent(raw.Ticker)}`,
    fecha: new Date(raw.TransactionDate),
    tickers: [{ ticker: raw.Ticker.toUpperCase(), tipo: inferTipo(raw.Ticker) }],
  };
}

module.exports = { normalizeFinnhubItem, normalizeQuiverItem, inferTipo };
