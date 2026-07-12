// src/services/currentsApi.js

const CURRENTS_BASE_URL = "https://api.currentsapi.services/v2";
const API_KEY = import.meta.env.VITE_CURRENTS_API_KEY;

/**
 * Busca noticias en Currents API relacionadas con un activo/ticker/sector.
 * Devuelve los artículos en su forma "cruda" (tal como los da Currents),
 * la normalización al shape de la app se hace en useMarketNews.js
 */
export async function searchCurrentsNews({
  query,
  category = "economy_business_finance",
  language = "es",
  startDate,
  endDate,
  pageSize = 10,
}) {
  if (!API_KEY) {
    throw new Error("Falta VITE_CURRENTS_API_KEY en tu .env");
  }

  const params = new URLSearchParams({
    keywords: query,
    category,
    language,
    page_size: String(pageSize),
    apiKey: API_KEY,
  });

  if (startDate) params.append("start_date", startDate);
  if (endDate) params.append("end_date", endDate);

  const res = await fetch(`${CURRENTS_BASE_URL}/search?${params.toString()}`);

  if (!res.ok) {
    throw new Error(`Currents API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();

  // Sin normalizar: id, title, description, url, author, language, category, published
  return data.news || [];
}