# Implementación HU1: Radar de Noticias y Activos

## 1. Objetivo y Criterios
[cite_start]Mostrar noticias recientes de al menos dos fuentes o un feed de prueba, relacionarlas con instrumentos y permitir filtros[cite: 25, 28, 29].

## 2. Componentes UI (React)
* **`NewsSidebar.jsx` (Columna 1):** Contenedor principal del radar.
* **`FilterBar.jsx`:** Inputs interactivos para filtrar por:
    * Tipo de instrumento (Select dropdown).
    * Búsqueda por Ticker/Activo (Text input).
    * Antigüedad (Radio buttons: 24h, 7d, 30d).
* [cite_start]**`NewsCard.jsx`:** Tarjeta individual que muestra el titular, la fuente (ej. Reuters, Bloomberg), la fecha y etiquetas (tags) con los tickers asociados[cite: 25, 28]. Incluye efectos hover definidos en el CSS global.

## 3. Lógica de Negocio (Frontend)
1.  Al montar el componente, `useEffect` llama a `finnhubService.getLatestNews()`.
2.  El resultado se almacena en el estado global `news`.
3.  Los filtros de `FilterBar.jsx` aplican un `.filter()` sobre el array de noticias en memoria para renderizar la lista dinámicamente sin volver a consultar la API.
4.  Al hacer clic en un `NewsCard`, se despacha la acción `SELECT_NEWS_ID`, activando la vista de la HU2.