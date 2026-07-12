const prisma = require("../lib/prisma");

const TIPOS_VALIDOS = ["ACCION", "CRIPTOACTIVO", "CREDITO", "OTRO"];
const MAX_LIMIT = 100;

function parseDaysAgo(raw) {
  if (raw === undefined) return null;
  const days = Number(raw);
  if (!Number.isFinite(days) || days < 0) return { error: "`days_ago` debe ser un número >= 0" };
  const desde = new Date();
  desde.setDate(desde.getDate() - days);
  return { desde };
}

/**
 * GET /api/noticias?instrument_type=&asset=&days_ago=&limit=&page=
 *
 * - instrument_type: ACCION | CRIPTOACTIVO | CREDITO | OTRO
 * - asset: match parcial case-insensitive contra el ticker (ej. "NVDA", "btc")
 * - days_ago: antigüedad máxima en días (24h -> 1, 7d -> 7, 30d -> 30)
 * - limit / page: paginación (opcional, default limit=20 page=1)
 */
async function listarNoticias(req, res) {
  const { instrument_type: instrumentType, asset, days_ago: daysAgo, limit, page } = req.query;

  if (instrumentType && !TIPOS_VALIDOS.includes(instrumentType.toUpperCase())) {
    return res.status(400).json({
      error: `instrument_type inválido. Valores permitidos: ${TIPOS_VALIDOS.join(", ")}`,
    });
  }

  const daysAgoResult = parseDaysAgo(daysAgo);
  if (daysAgoResult?.error) {
    return res.status(400).json({ error: daysAgoResult.error });
  }

  const take = Math.min(Number(limit) || 20, MAX_LIMIT);
  const currentPage = Math.max(Number(page) || 1, 1);
  const skip = (currentPage - 1) * take;

  // Filtro sobre la relación N:M: "al menos un instrumento vinculado que matchee
  // tipo y/o ticker". `some` traduce a un EXISTS eficiente en SQL en vez de traer
  // todo y filtrar en memoria.
  const instrumentoFiltro = {};
  if (instrumentType) instrumentoFiltro.tipo = instrumentType.toUpperCase();
  if (asset) instrumentoFiltro.ticker = { contains: asset, mode: "insensitive" };

  const where = {
    ...(daysAgoResult?.desde ? { fecha: { gte: daysAgoResult.desde } } : {}),
    ...(Object.keys(instrumentoFiltro).length > 0
      ? { instrumentos: { some: { instrumento: instrumentoFiltro } } }
      : {}),
  };

  try {
    // Se piden en paralelo el total (para paginar) y la página de resultados.
    const [total, noticias] = await prisma.$transaction([
      prisma.noticia.count({ where }),
      prisma.noticia.findMany({
        where,
        orderBy: { fecha: "desc" }, // usa el índice sobre `fecha`
        take,
        skip,
        include: {
          instrumentos: {
            include: { instrumento: true },
          },
        },
      }),
    ]);

    const data = noticias.map((n) => ({
      id: n.id,
      titulo: n.titulo,
      resumen: n.resumen,
      url: n.url,
      fuente: n.fuente,
      fecha: n.fecha,
      instrumentos: n.instrumentos.map((ni) => ({
        ticker: ni.instrumento.ticker,
        nombre: ni.instrumento.nombre,
        tipo: ni.instrumento.tipo,
      })),
    }));

    return res.json({
      data,
      pagination: {
        total,
        page: currentPage,
        limit: take,
        totalPages: Math.ceil(total / take) || 1,
      },
    });
  } catch (err) {
    console.error("[noticias.controller] Error listando noticias:", err);
    return res.status(500).json({ error: "Error interno al consultar noticias" });
  }
}

module.exports = { listarNoticias };
