import React, { useMemo } from 'react'
import { useDashboard } from '../context/DashboardContext'
import FilterBar from './FilterBar'
import NewsCard from './NewsCard'
import { getAssetType } from '../services/mockData'

export default function NewsSidebar() {
  const { 
    news, 
    filters, 
    isLoadingNews, 
    watchlists, 
    activeWatchlist,
  } = useDashboard()
  const { searchQuery, instrumentType, assetSymbol, recency } = filters

  const filteredNews = useMemo(() => {
    return news.filter((item) => {
      // 0. Active Watchlist Filter
      if (activeWatchlist && activeWatchlist !== 'Todos') {
        const watchlistObj = watchlists.find(w => w.name === activeWatchlist)
        if (watchlistObj) {
          const hasWatchlistAsset = item.assets.some(symbol => watchlistObj.assets.includes(symbol))
          if (!hasWatchlistAsset) return false
        }
      }

      // 1. Search Query
      if (searchQuery) {
        const matchesHeadline = item.headline.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesSummary = item.summary.toLowerCase().includes(searchQuery.toLowerCase())
        if (!matchesHeadline && !matchesSummary) return false
      }

      // 2. Instrument Type
      if (instrumentType !== 'Todos') {
        const hasAssetOfType = item.assets.some((symbol) => {
          return getAssetType(symbol) === instrumentType
        })
        if (!hasAssetOfType) return false
      }

      // 3. Asset Symbol
      if (assetSymbol !== 'Todos') {
        if (!item.assets.includes(assetSymbol)) return false
      }

      // 4. Recency
      if (recency !== 'Todos') {
        const newsDate = new Date(item.date)
        const now = new Date()
        const diffTime = Math.abs(now - newsDate)
        const diffDays = diffTime / (1000 * 60 * 60 * 24)

        if (recency === '24h' && diffDays > 1) return false
        if (recency === '7d' && diffDays > 7) return false
        if (recency === '30d' && diffDays > 30) return false
      }

      return true
    })
  }, [news, searchQuery, instrumentType, assetSymbol, recency, watchlists, activeWatchlist])

  return (
    <section className="feed-section">
      <div className="section-header">
        <h2>Radar de Noticias y Activos</h2>
        <span className="count-badge">{filteredNews.length} Noticias</span>
      </div>

      <FilterBar />

      <div className="news-list-container">
        {isLoadingNews ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Cargando noticias...</p>
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="empty-state">
            <p>No se encontraron noticias con los filtros actuales.</p>
          </div>
        ) : (
          filteredNews.map((item) => <NewsCard key={item.id} item={item} />)
        )}
      </div>
    </section>
  )
}
