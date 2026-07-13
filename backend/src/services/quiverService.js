const axios = require("axios");
const { quiver } = require("../config/env");

const client = axios.create({
  baseURL: quiver.baseUrl,
  timeout: 10_000,
  headers: { Authorization: `Bearer ${quiver.apiKey}` },
});

/**
 * Quiver Quantitative no expone "noticias" en el sentido tradicional; expone eventos
 * de mercado accionables (trading del Congreso, insiders, contratos de gobierno, etc.)
 * que en este pipeline tratamos como "noticias/eventos" vinculables a un instrumento.
 *
 * Se usa como ejemplo el feed de trading del Congreso, que es público y bien documentado:
 * Docs: https://api.quiverquant.com/beta/live/congresstrading
 * Respuesta cruda por item (campos relevantes):
 * { Representative, ReportDate, TransactionDate, Ticker, Transaction, Range, ... }
 *
 * Si el equipo prefiere otro feed de Quiver (insiders, off-exchange, gov contracts),
 * basta con cambiar el endpoint acá; `normalize.js` ya soporta remapear el shape.
 */
async function fetchCongressTradingEvents() {
  const { data } = await client.get("/live/congresstrading");
  return Array.isArray(data) ? data : [];
}

module.exports = { fetchCongressTradingEvents };
