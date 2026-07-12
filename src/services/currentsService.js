import { INITIAL_NEWS } from './mockData'

const API_KEY = import.meta.env.VITE_FINNHUB_API_KEY
const USE_MOCK = !API_KEY || API_KEY.includes('your_') || API_KEY.trim() === ''

export const finnhubService = {
  getLatestNews: async () => {
    if (USE_MOCK) {
      console.warn("Finnhub API key is not configured or uses placeholder. Falling back to local mock news.")
      // Return local mock news data with realistic delay
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(INITIAL_NEWS)
        }, 800)
      })
    }

    try {
      // Finnhub General Market News API
      const response = await fetch(`https://finnhub.io/api/v1/news?category=general&token=${API_KEY}`)
      if (!response.ok) {
        throw new Error(`Finnhub API returned status ${response.status}`)
      }
      const data = await response.json()
      
      if (!Array.isArray(data) || data.length === 0) {
        return INITIAL_NEWS
      }

      // Map to standard internal format
      // Note: Finnhub returns timestamps in seconds, we need milliseconds
      // related is a single ticker. Let's make sure it is in an array if present.
      return data.map((item) => {
        const assets = []
        if (item.related) {
          // split related by comma or spaces just in case, clean up
          const symbols = item.related.split(/[\s,]+/).map(s => s.trim().toUpperCase()).filter(Boolean)
          assets.push(...symbols)
        }

        return {
          id: `finnhub-${item.id}`,
          headline: item.headline,
          source: item.source || 'Finnhub',
          date: new Date(item.datetime * 1000).toISOString(),
          assets: assets,
          summary: item.summary || 'No details provided.',
          // These AI properties will be generated when user selects/analyzes the news
          impact: null, 
          confidence: null,
          explanation: null,
          evidence: null,
          historicalComparison: null,
        }
      })
    } catch (error) {
      console.error("Finnhub API request failed, using local mock news fallback:", error)
      return INITIAL_NEWS
    }
  }
}
