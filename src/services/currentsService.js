const API_KEY = import.meta.env.VITE_CURRENTS_API_KEY
const USE_MOCK = !API_KEY || API_KEY.includes('your_') || API_KEY.trim() === ''

const CURRENTS_BASE_URL = 'https://api.currentsapi.services/v2'

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

async function searchOneAsset(asset) {
  const params = new URLSearchParams({
    keywords: asset.name,
    language: 'en',
    page_size: '5',
    apiKey: API_KEY,
  })

  const response = await fetch(`${CURRENTS_BASE_URL}/search?${params.toString()}`)
  if (!response.ok) {
    throw new Error(`Currents API returned status ${response.status} for ${asset.symbol}`)
  }
  const data = await response.json()
  const articles = data.news || []

  return articles.map((item) => ({
    id: `currents-${item.id}`,
    headline: item.title,
    source: item.author || 'Currents',
    date: item.published,
    assets: [asset.symbol],
    summary: item.description || 'No details provided.',
    impact: null,
    confidence: null,
    explanation: null,
    evidence: item.url || null,
    historicalComparison: null,
  }))
}

export const currentsService = {
  getLatestNews: async () => {
    if (USE_MOCK) {
      console.warn("Currents API key is not configured or uses placeholder. Skipping Currents source.")
      return []
    }

    try {
      const results = await Promise.all(
        WATCHED_ASSETS.map((asset) =>
          searchOneAsset(asset).catch((err) => {
            console.error(`Currents request failed for ${asset.symbol}:`, err)
            return []
          })
        )
      )
      return results.flat()
    } catch (error) {
      console.error("Currents API request failed entirely, returning empty list:", error)
      return []
    }
  }
}