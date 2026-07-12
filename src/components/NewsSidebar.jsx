import React, { useMemo, useState } from 'react'
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
    setActiveWatchlist, 
    addWatchlist, 
    deleteWatchlist 
  } = useDashboard()
  const { searchQuery, instrumentType, assetSymbol, recency } = filters

  const [isCreating, setIsCreating] = useState(false)
  const [newListName, setNewListName] = useState('')
  const [newListAssets, setNewListAssets] = useState('')

  const handleCreateWatchlist = (e) => {
    e.preventDefault()
    if (!newListName.trim()) return

    const assets = newListAssets
      .split(',')
      .map(s => s.trim().toUpperCase())
      .filter(Boolean)

    addWatchlist({
      name: newListName.trim(),
      assets
    })

    setActiveWatchlist(newListName.trim())
    setNewListName('')
    setNewListAssets('')
    setIsCreating(false)
  }

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

      {/* Watchlist Manager Panel */}
      <div className="watchlist-manager-panel">
        <div className="watchlist-selector-header">
          <span className="section-subtitle">Mis Listas de Seguimiento</span>
          <button 
            className="btn-add-watchlist" 
            onClick={() => setIsCreating(!isCreating)}
            title="Crear nueva lista de seguimiento"
          >
            {isCreating ? 'Cancelar' : '+ Nueva Lista'}
          </button>
        </div>

        {isCreating ? (
          <form className="watchlist-form" onSubmit={handleCreateWatchlist}>
            <input 
              type="text" 
              placeholder="Nombre (ej: Mis Favoritos)" 
              required
              value={newListName}
              onChange={e => setNewListName(e.target.value)}
              className="watchlist-input"
            />
            <input 
              type="text" 
              placeholder="Activos (ej: NVDA, BTC, LQD)" 
              required
              value={newListAssets}
              onChange={e => setNewListAssets(e.target.value)}
              className="watchlist-input"
            />
            <button type="submit" className="btn-save-watchlist">Crear</button>
          </form>
        ) : (
          <div className="watchlist-pills">
            <button
              className={`pill-btn ${activeWatchlist === 'Todos' ? 'active' : ''}`}
              onClick={() => setActiveWatchlist('Todos')}
            >
              Todas
            </button>
            {watchlists.map(w => (
              <div key={w.name} className={`pill-wrapper ${activeWatchlist === w.name ? 'active' : ''}`}>
                <button
                  className="pill-btn-select"
                  onClick={() => setActiveWatchlist(w.name)}
                >
                  {w.name} <span className="pill-asset-count">({w.assets.length})</span>
                </button>
                <button 
                  className="pill-btn-delete" 
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteWatchlist(w.name)
                  }}
                  title="Eliminar lista"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
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
