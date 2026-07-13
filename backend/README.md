# Backend — Radar de Noticias (Track 5)

API + pipeline de ingesta para la HU1 (`docs/02_hu1_radar_noticias_recomendaciones.md`).
Stack: **Node.js + Express + Prisma + PostgreSQL**.

## 1. Setup

```bash
cd backend
cp .env.example .env      # completar DATABASE_URL, FINNHUB_API_KEY, QUIVER_API_KEY
npm install
npm run prisma:migrate    # crea las tablas instrumentos / noticias / noticias_instrumentos
```

## 2. Levantar la API

```bash
npm run dev        # http://localhost:4000, con --watch
# o
npm start
```

Al bootear, si `INGEST_RUN_ON_BOOT=true`, se dispara una ingesta inicial y luego
queda programado un cron (`INGEST_CRON_SCHEDULE`, default cada 15 min) que vuelve
a consumir Finnhub y Quiver periódicamente.

## 3. Correr la ingesta manualmente

```bash
npm run ingest:once            # corrida única vía CLI
curl -X POST http://localhost:4000/api/ingest/run   # corrida única vía HTTP (demo)
```

## 4. Endpoint principal

```
GET /api/noticias?instrument_type=ACCION&asset=NVDA&days_ago=7&limit=20&page=1
```

| Query param       | Tipo               | Descripción                                                        |
|--------------------|--------------------|---------------------------------------------------------------------|
| `instrument_type`  | `ACCION\|CRIPTOACTIVO\|CREDITO\|OTRO` | Filtra por tipo de instrumento vinculado           |
| `asset`             | string             | Match parcial (case-insensitive) contra el ticker, ej. `NVDA`, `btc` |
| `days_ago`          | número              | Antigüedad máxima en días (24h→`1`, 7d→`7`, 30d→`30`)               |
| `limit` / `page`    | número              | Paginación, `limit` tope 100                                       |

Respuesta:

```json
{
  "data": [
    {
      "id": 12,
      "titulo": "Nvidia anuncia...",
      "resumen": "...",
      "url": "https://...",
      "fuente": "FINNHUB",
      "fecha": "2026-07-10T14:32:00.000Z",
      "instrumentos": [{ "ticker": "NVDA", "nombre": null, "tipo": "ACCION" }]
    }
  ],
  "pagination": { "total": 42, "page": 1, "limit": 20, "totalPages": 3 }
}
```

## 5. Estructura

```
backend/
  prisma/schema.prisma          # Noticia, Instrumento, NoticiaInstrumento (N:M)
  src/
    config/env.js                # variables de entorno centralizadas
    lib/prisma.js                 # cliente Prisma singleton
    services/
      finnhubService.js           # fetch crudo a Finnhub
      quiverService.js             # fetch crudo a Quiver Quantitative
      normalize.js                  # JSON crudo -> shape común
      ingestService.js               # normaliza + upsert idempotente en DB
    jobs/ingestJob.js                # node-cron: corre ingestService periódicamente
    controllers/noticias.controller.js  # lógica del GET con filtros
    routes/noticias.routes.js
    scripts/runIngestOnce.js         # CLI para correr un ciclo de ingesta suelto
    app.js / server.js
```

## 6. Decisiones de diseño

- **Idempotencia:** cada `Noticia` tiene una unique key `(fuente, fuenteId)`. Reconsumir
  la misma fuente no genera duplicados: se hace `upsert`, no `insert`.
- **Instrumentos como catálogo compartido:** `Instrumento.ticker` es único; si dos noticias
  de fuentes distintas mencionan `NVDA`, se reusa la misma fila y se agregan dos filas en
  `noticias_instrumentos`.
- **Filtros vía relación N:M:** el filtro `instrument_type`/`asset` usa `some` sobre la
  relación (`instrumentos: { some: { instrumento: {...} } }`), que Prisma traduce a un
  `EXISTS` en SQL en vez de traer todo a memoria y filtrar en JS.
- **Índices:** `Noticia.fecha` (para `days_ago` + `ORDER BY`), `Instrumento.tipo` (para
  `instrument_type`) e `Instrumento.ticker` único (para `asset` y upserts).
- **Fuente Quiver:** se usa como ejemplo el feed público de *congress trading*
  (`/live/congresstrading`), tratando cada operación reportada como un evento vinculable
  a un ticker. Si el equipo quiere otro feed de Quiver, se reemplaza el fetch en
  `quiverService.js` y el mapeo en `normalize.js`; el resto del pipeline no cambia.
