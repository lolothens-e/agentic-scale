const API_KEY = import.meta.env.VITE_ALPHAVANTAGE_API_KEY
const USE_MOCK = !API_KEY || API_KEY.includes('your_') || API_KEY.trim() === ''

export const alphaService = {
  getLatestNews: async () => {
    if (USE_MOCK) {
      console.warn("Alpha Vantage API key is not configured or uses placeholder. Omiting Alpha Vantage feed.")
      return []
    }

    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&limit=15&apikey=${API_KEY}`
      )
      if (!response.ok) {
        throw new Error(`Alpha Vantage API returned status ${response.status}`)
      }
      
      const data = await response.json()
      
      if (!data.feed || !Array.isArray(data.feed)) {
        console.warn("Alpha Vantage response contains no feed or limit reached:", data)
        return []
      }

      return data.feed.map((item, index) => {
        // Map Alpha Vantage sentiment score/label to internal impact category
        let impact = null
        const label = item.overall_sentiment_label ? item.overall_sentiment_label.toLowerCase() : ''
        
        if (label.includes('bullish')) {
          impact = 'Positivo'
        } else if (label.includes('bearish')) {
          impact = 'Negativo'
        } else if (label.includes('neutral')) {
          impact = 'Neutral'
        } else {
          impact = 'Incierto'
        }

        // Map tickers
        const assets = item.ticker_sentiment
          ? item.ticker_sentiment.map((t) => t.ticker.toUpperCase())
          : []

        return {
          id: `alpha-${index}-${Date.now()}`,
          headline: item.title,
          source: item.source || 'Alpha Vantage',
          date: parseAlphaDate(item.time_published),
          assets: assets.slice(0, 3), // Keep first 3 tickers for display
          summary: item.summary || 'No summary details provided.',
          impact: impact,
          confidence: Math.round((item.overall_sentiment_score + 1) * 50) || 75, // Scale -1..1 to 0..100
          explanation: `Clasificado automáticamente por Alpha Vantage como ${item.overall_sentiment_label}.`,
          evidence: `Puntuación de sentimiento general de ${item.overall_sentiment_score}. Temas clave: ${
            item.topics ? item.topics.slice(0, 2).map((t) => t.topic).join(', ') : 'Finanzas'
          }`,
          historicalComparison: 'Datos históricos comparativos según métricas de sentimiento agregadas por Alpha Vantage.',
        }
      })
    } catch (error) {
      console.error("Alpha Vantage fetch failed:", error)
      return []
    }
  }
}

function parseAlphaDate(dateStr) {
  // Format from Alpha Vantage is YYYYMMDDTHHMMSS
  // e.g. 20260711T234500 -> 2026-07-11T23:45:00Z
  if (!dateStr || dateStr.length < 15) return new Date().toISOString()
  try {
    const y = dateStr.substring(0, 4)
    const m = dateStr.substring(4, 6)
    const d = dateStr.substring(6, 8)
    const h = dateStr.substring(9, 11)
    const min = dateStr.substring(11, 13)
    const s = dateStr.substring(13, 15)
    return `${y}-${m}-${d}T${h}:${min}:${s}Z`
  } catch {
    return new Date().toISOString()
  }
}
