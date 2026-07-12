import React from 'react'
import { useDashboard } from '../context/DashboardContext'
import { INITIAL_ASSETS } from '../services/mockData'

export default function NewsCard({ item }) {
  const { selectedNewsId, selectNews } = useDashboard()
  const isSelected = item.id === selectedNewsId
  
  const impactClass = item.impact 
    ? `impact-tag ${item.impact.toLowerCase()}` 
    : 'impact-tag pending-analysis'

  const dateObj = new Date(item.date)
  const formattedDate = dateObj.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div
      className={`news-card ${isSelected ? 'selected' : ''}`}
      onClick={() => selectNews(item.id)}
    >
      <div className="news-card-header">
        <div className="news-source-meta">
          <span className="source-badge">{item.source}</span>
          <span className="date-text">{formattedDate}</span>
        </div>
        <span className={impactClass}>{item.impact || 'Analizando...'}</span>
      </div>

      <h3 className="news-headline">{item.headline}</h3>

      <p className="news-summary-preview">
        {item.summary.length > 140 ? `${item.summary.substring(0, 140)}...` : item.summary}
      </p>

      <div className="news-tags">
        {item.assets && item.assets.map((symbol) => {
          const assetObj = INITIAL_ASSETS.find((a) => a.symbol === symbol)
          const assetType = assetObj ? assetObj.type : 'Activo'
          return (
            <span key={symbol} className="asset-tag" title={assetType}>
              {symbol}
            </span>
          )
        })}
      </div>
    </div>
  )
}
