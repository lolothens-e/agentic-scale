// src/hooks/useMarketNews.js
import { useState, useCallback } from "react";
import { searchCurrentsNews } from "../services/currentsApi";

export function useMarketNews() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNewsForAssets = useCallback(async (assets, daysAgo = 7) => {
  setLoading(true);
  setError(null);

  try {
    const results = await Promise.all(
      assets.map(async (asset) => {
        const articles = await searchCurrentsNews({ query: asset.name });

        // Filtro de relevancia: descarta artículos que no mencionen el activo
        const relevantes = articles.filter((a) => {
          const texto = `${a.title} ${a.description}`.toLowerCase();
          return (
            texto.includes(asset.name.toLowerCase()) ||
            texto.includes(asset.symbol.toLowerCase())
          );
        });

        return relevantes.map((a) => ({
          id: a.id,
          headline: a.title,
          source: a.author || "Currents",
          date: a.published,
          assets: [asset.symbol],
          summary: a.description || "",
          impact: "Incierto",
          confidence: 0,
          historicalComparison: "Pendiente de análisis.",
          explanation: "Noticia obtenida de Currents API, sin señal generada aún.",
          evidence: a.url,
        }));
      })
    );

    return results.flat();
  } catch (e) {
    setError(e.message);
    return [];
  } finally {
    setLoading(false);
  }
}, []);

  return { fetchNewsForAssets, loading, error };
}