# Implementación Backend: Ingesta y API del Radar de Noticias (H.U. 1)

## 1. Objetivo
Reemplazar el `initialNewsData` mockeado de `App.jsx` por datos reales, persistidos en
PostgreSQL y consumidos vía `GET /api/noticias`, siguiendo el diagrama de secuencia de
`plan_implementacion.md`.

## 2. Esquema de datos (PostgreSQL vía Prisma)
* **`instrumentos`**: catálogo de activos (`ticker` único, `tipo`: acción / criptoactivo /
  crédito / otro), usado por el filtro `?instrument_type=`.
* **`noticias`**: evento/noticia con `fuente` (`FINNHUB`/`QUIVER`) y `fecha` del evento
  (no de ingesta). Unique key `(fuente, fuenteId)` para upserts idempotentes.
* **`noticias_instrumentos`**: tabla puente N:M — una noticia puede tener varios tickers
  asociados, y viceversa.

## 3. Pipeline de ingesta (`backend/src/services`)
1. `finnhubService.js` / `quiverService.js` traen el JSON crudo de cada API.
2. `normalize.js` lo traduce a un shape común (`fuente`, `fuenteId`, `titulo`, `resumen`,
   `url`, `fecha`, `tickers[]`).
3. `ingestService.js` hace `upsert` de `Instrumento` y `Noticia`, y reconstruye los links
   en `NoticiaInstrumento` — reconsumir la misma fuente no duplica filas.
4. `jobs/ingestJob.js` programa el ciclo con `node-cron` (`INGEST_CRON_SCHEDULE`) y expone
   un disparador manual (`POST /api/ingest/run`) para demos.

## 4. Endpoint `GET /api/noticias`
Implementado en `controllers/noticias.controller.js`. Traduce los tres filtros de la HU1
(`instrument_type`, `asset`, `days_ago`) a un único `where` de Prisma que se resuelve con
`EXISTS` + índices en SQL (no se trae todo a memoria):

```javascript
const where = {
  ...(daysAgo ? { fecha: { gte: desde } } : {}),
  ...(hayFiltroInstrumento
    ? { instrumentos: { some: { instrumento: { tipo, ticker: { contains: asset, mode: "insensitive" } } } } }
    : {}),
};
```

## 5. Conexión con el frontend
`docs/plan_implementacion.md` ya prevé `fetchMarketNews()` como punto de entrada. Basta con
apuntarlo a `GET /api/noticias?days_ago=1` y mapear la respuesta (`data[]`) al shape que
espera `NewsCard.jsx` (`titulo` → `headline`, `instrumentos[].ticker` → `tags`).
