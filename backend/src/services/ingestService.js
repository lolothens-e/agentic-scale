const prisma = require("../lib/prisma");
const finnhubService = require("./finnhubService");
const quiverService = require("./quiverService");
const { normalizeFinnhubItem, normalizeQuiverItem } = require("./normalize");

/**
 * Crea el Instrumento si no existe (por ticker) y devuelve su id.
 * `upsert` lo hace idempotente: si dos noticias distintas mencionan el mismo
 * ticker en la misma corrida, no se duplica la fila.
 */
async function upsertInstrumento({ ticker, tipo }) {
  const instrumento = await prisma.instrumento.upsert({
    where: { ticker },
    update: {}, // no pisamos `tipo`/`nombre` si ya existía con datos curados a mano
    create: { ticker, tipo },
  });
  return instrumento.id;
}

/**
 * Persiste una noticia normalizada junto a sus vínculos NoticiaInstrumento.
 * Usa `upsert` sobre la unique key (fuente, fuenteId) para que reconsumir la
 * misma fuente varias veces al día no genere duplicados (idempotencia).
 */
async function upsertNoticiaNormalizada(item) {
  const instrumentoIds = await Promise.all(item.tickers.map(upsertInstrumento));

  const noticia = await prisma.noticia.upsert({
    where: {
      fuente_fuenteId_unique: { fuente: item.fuente, fuenteId: item.fuenteId },
    },
    update: {
      titulo: item.titulo,
      resumen: item.resumen,
      url: item.url,
      fecha: item.fecha,
    },
    create: {
      fuente: item.fuente,
      fuenteId: item.fuenteId,
      titulo: item.titulo,
      resumen: item.resumen,
      url: item.url,
      fecha: item.fecha,
    },
  });

  // Vincula (o revincula) los instrumentos detectados, sin duplicar filas puente.
  await Promise.all(
    instrumentoIds.map((instrumentoId) =>
      prisma.noticiaInstrumento.upsert({
        where: { noticiaId_instrumentoId: { noticiaId: noticia.id, instrumentoId } },
        update: {},
        create: { noticiaId: noticia.id, instrumentoId },
      })
    )
  );

  return noticia;
}

async function ingestFinnhub() {
  const rawItems = await finnhubService.fetchAllWatchlistNews();
  const normalizados = rawItems.map(normalizeFinnhubItem).filter(Boolean);

  let guardadas = 0;
  for (const item of normalizados) {
    await upsertNoticiaNormalizada(item);
    guardadas += 1;
  }
  return { fuente: "FINNHUB", recibidas: rawItems.length, guardadas };
}

async function ingestQuiver() {
  const rawItems = await quiverService.fetchCongressTradingEvents();
  const normalizados = rawItems.map(normalizeQuiverItem).filter(Boolean);

  let guardadas = 0;
  for (const item of normalizados) {
    await upsertNoticiaNormalizada(item);
    guardadas += 1;
  }
  return { fuente: "QUIVER", recibidas: rawItems.length, guardadas };
}

/** Corre ambas fuentes. Si una falla, no tumba a la otra. */
async function runIngestCycle() {
  const startedAt = new Date();
  const resultados = await Promise.allSettled([ingestFinnhub(), ingestQuiver()]);

  const resumen = resultados.map((r, idx) => {
    if (r.status === "fulfilled") return r.value;
    return { fuente: idx === 0 ? "FINNHUB" : "QUIVER", error: r.reason.message };
  });

  console.log(
    `[ingest] Ciclo terminado en ${Date.now() - startedAt.getTime()}ms:`,
    JSON.stringify(resumen)
  );
  return resumen;
}

module.exports = { runIngestCycle, ingestFinnhub, ingestQuiver };
