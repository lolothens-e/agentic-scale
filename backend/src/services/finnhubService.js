const axios = require("axios");
const { finnhub } = require("../config/env");

const client = axios.create({
  baseURL: finnhub.baseUrl,
  timeout: 10_000,
});

function toYYYYMMDD(date) {
  return date.toISOString().slice(0, 10);
}

/**
 * Trae noticias de compañía para un ticker puntual.
 * Docs: https://finnhub.io/docs/api/company-news
 * Respuesta cruda por item:
 * { category, datetime, headline, id, image, related, source, summary, url }
 */
async function fetchCompanyNews(ticker, lookbackDays = finnhub.lookbackDays) {
  const to = new Date();
  const from = new Date(to.getTime() - lookbackDays * 24 * 60 * 60 * 1000);

  const { data } = await client.get("/company-news", {
    params: {
      symbol: ticker,
      from: toYYYYMMDD(from),
      to: toYYYYMMDD(to),
      token: finnhub.apiKey,
    },
  });

  // Finnhub devuelve [] si no hay novedades o si el ticker no es válido (no tira error).
  return Array.isArray(data) ? data.map((item) => ({ ...item, __watchlistTicker: ticker })) : [];
}

/**
 * Recorre toda la watchlist configurada y junta las noticias crudas.
 * Se ejecuta secuencial con un pequeño delay para respetar el rate limit gratuito de Finnhub.
 */
async function fetchAllWatchlistNews(watchlist = finnhub.watchlist) {
  const results = [];
  for (const ticker of watchlist) {
    try {
      const items = await fetchCompanyNews(ticker);
      results.push(...items);
    } catch (err) {
      console.error(`[finnhub] Error consultando noticias de ${ticker}:`, err.message);
    }
    // Cortesía con el rate limit (plan free ~ 60 req/min).
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  return results;
}

module.exports = { fetchCompanyNews, fetchAllWatchlistNews };
