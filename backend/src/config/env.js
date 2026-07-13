require("dotenv").config();

function required(name, fallback = undefined) {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    // No tiramos el proceso abajo para poder correr `prisma generate`, etc.
    // sin todas las keys; pero avisamos fuerte en consola.
    console.warn(`[config] Falta la variable de entorno ${name}`);
  }
  return value;
}

module.exports = {
  port: Number(process.env.PORT || 4000),

  finnhub: {
    apiKey: required("FINNHUB_API_KEY"),
    watchlist: (process.env.FINNHUB_WATCHLIST || "NVDA,AAPL,TSLA,BTC-USD")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    lookbackDays: Number(process.env.FINNHUB_LOOKBACK_DAYS || 1),
    baseUrl: "https://finnhub.io/api/v1",
  },

  quiver: {
    apiKey: required("QUIVER_API_KEY"),
    baseUrl: process.env.QUIVER_BASE_URL || "https://api.quiverquant.com/beta",
  },

  ingest: {
    cronSchedule: process.env.INGEST_CRON_SCHEDULE || "*/15 * * * *",
    runOnBoot: (process.env.INGEST_RUN_ON_BOOT || "true").toLowerCase() === "true",
  },
};
