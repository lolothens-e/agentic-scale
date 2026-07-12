# Integración de Currents API — Radar de Noticias y Activos (HU1)

**Proyecto:** ScaleAgents — Track 5: Inteligencia de Mercado y Recomendaciones Financieras
**Historia de Usuario:** HU1 — Radar de noticias y activos
**Fecha de integración:** Julio 2026
**Responsable:** Ivandresalin

---

## 1. Objetivo

Integrar [Currents API](https://currentsapi.services/) como una fuente adicional de noticias reales en tiempo real, cumpliendo el criterio de aceptación de la HU1 que exige mostrar noticias de **al menos dos fuentes aprobadas**, con fuente y fecha, relacionadas con instrumentos financieros.

Currents API corre en paralelo a Finnhub y Alpha Vantage dentro de la arquitectura de agregación de noticias del proyecto.

---

## 2. Arquitectura general

El proyecto centraliza la carga de noticias en `DashboardContext.jsx`, que combina múltiples fuentes en paralelo y las normaliza a un formato común antes de guardarlas en el estado global.

```
DashboardContext.jsx
   │
   ├── finnhubService.getLatestNews()      → noticias generales de mercado
   ├── alphaService.getLatestNews()        → noticias de Alpha Vantage
   ├── currentsService.getLatestNews()     → noticias de Currents API (esta integración)
   │
   └── Promise.all([...]) → merge + deduplicación por headline → guardado en estado + localStorage
```

Cada noticia nueva se guarda con `impact: null`, `confidence: null`, etc. El propio contexto detecta esos campos vacíos cuando el usuario selecciona la noticia y dispara automáticamente el análisis de IA (`llmService.analyzeNews`) para generar la señal de impacto (HU2). Esto significa que **Currents API solo se encarga de traer noticias crudas**; no genera señales de impacto por sí sola.

---

## 3. Archivos creados/modificados

| Archivo | Tipo de cambio | Descripción |
|---|---|---|
| `src/services/currentsService.js` | Nuevo | Cliente de Currents API: hace las búsquedas por activo y normaliza la respuesta |
| `src/context/DashboardContext.jsx` | Modificado | Se agregó `currentsService` al `Promise.all` de carga inicial de noticias |
| `.env` | Modificado | Se agregó la variable `VITE_CURRENTS_API_KEY` |

---

## 4. Configuración

### 4.1 Obtener la API key

1. Registro gratuito en: https://currentsapi.services/en/register
2. Plan free: **1,000 requests/día**

### 4.2 Variable de entorno

En el archivo `.env` de la raíz del proyecto (mismo nivel que `package.json`, **no** dentro de `src/`):

```bash
VITE_CURRENTS_API_KEY=tu_api_key_aqui
```

> ⚠️ El archivo `.env` debe estar en `.gitignore` para no exponer la key en el repositorio público. Vite solo lee las variables de entorno al arrancar el servidor — cualquier cambio en `.env` requiere reiniciar `npm run dev`.

---

## 5. Detalle técnico: `currentsService.js`

### 5.1 Activos vigilados

El servicio busca noticias para una lista fija de activos, usando el **nombre** del activo (no el ticker) como palabra clave, ya que mejora sustancialmente el matching de resultados en el buscador de Currents:

```javascript
const WATCHED_ASSETS = [
  { symbol: 'NVDA', name: 'NVIDIA' },
  { symbol: 'TSLA', name: 'Tesla' },
  { symbol: 'AAPL', name: 'Apple' },
  { symbol: 'BTC', name: 'Bitcoin' },
  { symbol: 'ETH', name: 'Ethereum' },
  { symbol: 'US10Y', name: 'US Treasury bonds' },
  { symbol: 'LQD', name: 'corporate bonds' },
  { symbol: 'GLD', name: 'Gold price' },
]
```

### 5.2 Endpoint utilizado

```
GET https://api.currentsapi.services/v2/search
```

**Parámetros enviados:**

| Parámetro | Valor | Notas |
|---|---|---|
| `keywords` | Nombre del activo (ej. `"NVIDIA"`) | Búsqueda de texto libre |
| `language` | `en` | El inglés da mucha mayor cobertura para acciones/bonos de EE.UU. que el español |
| `page_size` | `5` | Límite de resultados por activo, para no agotar la cuota diaria |
| `apiKey` | Variable de entorno | — |


### 5.3 Modo mock (fallback sin key)

Si `VITE_CURRENTS_API_KEY` no está configurada, el servicio no lanza error: devuelve una lista vacía y deja un `console.warn`, permitiendo que el resto de fuentes (Finnhub, Alpha Vantage) sigan funcionando con normalidad.

```javascript
const USE_MOCK = !API_KEY || API_KEY.includes('your_') || API_KEY.trim() === ''
```

### 5.4 Normalización de datos

Cada artículo de Currents se transforma al formato estándar interno del proyecto:

| Campo interno | Origen en Currents | Notas |
|---|---|---|
| `id` | `currents-{item.id}` | Prefijo para evitar colisión con IDs de otras fuentes |
| `headline` | `item.title` | |
| `source` | `item.author` (o `"Currents"` si no viene) | |
| `date` | `item.published` | |
| `assets` | `[asset.symbol]` | Se asigna el símbolo del activo que originó la búsqueda |
| `summary` | `item.description` | |
| `impact`, `confidence`, `explanation`, `historicalComparison` | `null` | Se completan después por `llmService` (HU2) |
| `evidence` | `item.url` | Enlace al artículo original |

### 5.5 Manejo de errores

- Cada búsqueda por activo está envuelta en su propio `.catch()`, de forma que si Currents falla para un activo puntual (rate limit, timeout, etc.), no afecta a los demás.
- Si la API falla por completo, el servicio devuelve `[]` en vez de romper la carga de noticias del resto de fuentes.

---

## 6. Flujo de datos end-to-end

```
1. App carga → DashboardProvider monta → useEffect dispara loadInitialNews()
2. Promise.all ejecuta en paralelo: finnhubService, alphaService, currentsService
3. currentsService busca noticias para cada uno de los 8 activos vigilados
4. Resultados se combinan (flat), normalizados al shape común
5. DashboardContext deduplica por headline y ordena por fecha descendente
6. Noticias se guardan en el estado global + localStorage (cache)
7. Usuario selecciona una noticia sin análisis (impact === null)
8. Se dispara automáticamente llmService.analyzeNews() → genera impact/confidence/explanation
9. UI (NewsSidebar, ImpactDetail) refleja los datos combinados de todas las fuentes
```

---

## 7. Verificación / Troubleshooting

### Cómo confirmar que Currents está corriendo

1. **Consola del navegador:** si NO aparece el warning `"Currents API key is not configured..."`, la key está bien configurada.
2. **Pestaña Network (DevTools):** filtrar por `currentsapi` — deben verse múltiples peticiones (una por activo) a `api.currentsapi.services/v2/search` con status `200`.

## 8. Limitaciones conocidas

- **Cuota diaria:** el plan free de Currents permite 1,000 requests/día, suficiente para el alcance del hackathon con datos reales, pero no pensado para uso en producción a escala.
- **Sin análisis de impacto propio:** Currents únicamente entrega noticias crudas; la clasificación de impacto/confianza depende enteramente de `llmService` (HU2), que a su vez depende de la disponibilidad de la API de Gemini.
- **Exposición de la API key en el cliente:** al ser un proyecto React/Vite sin backend, la key queda visible en el bundle del navegador (aceptable para el alcance de la demo del hackathon, según la regla de "integraciones simuladas" del track; no recomendable para producción sin un proxy/backend intermedio).

---

## 9. Posibles mejoras futuras

- Mover la llamada a Currents API detrás de una función serverless (Vercel/Netlify) para no exponer la key en el cliente.
- Ampliar la lista de `WATCHED_ASSETS` o hacerla dinámica según las watchlists del usuario (`state.watchlists`).
- Agregar caché local por activo con expiración, para reducir el consumo de la cuota diaria entre recargas de desarrollo.
