import React from 'react'
import { useDashboard } from '../context/DashboardContext'
import ImpactBadge from './ImpactBadge'
import PriceComparison from './PriceComparison'
import HistoricalChart from './HistoricalChart'
import LegalDisclaimer from './LegalDisclaimer'

export default function ImpactDetail() {
  const { news, briefings, selectedNewsId, isLoadingAnalysis, createBriefing, createWatchlistBriefing, activeWatchlist } = useDashboard()

  const selectedNews = news.find((item) => item.id === selectedNewsId)

  const hasBriefing = selectedNews && briefings.some(b => b.newsHeadline === selectedNews.headline)

  const handleGenerateBriefing = () => {
    if (selectedNews && !hasBriefing) {
      createBriefing(selectedNews.id)
    }
  }

  if (isLoadingAnalysis) {
    return (
      <section className="detail-section">
        <div className="section-header">
          <h2>Señal de Impacto Explicable</h2>
        </div>
        <div className="detail-card skeleton-container">
          <div className="skeleton-header">
            <div className="skeleton-line short animate-pulse"></div>
            <div className="skeleton-line title animate-pulse"></div>
            <div className="skeleton-line subtitle animate-pulse"></div>
          </div>
          <div className="skeleton-metrics">
            <div className="skeleton-box animate-pulse"></div>
            <div className="skeleton-box animate-pulse"></div>
          </div>
          <div className="skeleton-body">
            <div className="skeleton-line animate-pulse"></div>
            <div className="skeleton-line animate-pulse"></div>
            <div className="skeleton-line animate-pulse"></div>
            <div className="skeleton-line short animate-pulse"></div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="detail-section">
      <div className="section-header">
        <h2>Señal de Impacto Explicable</h2>
        {activeWatchlist === 'Todos' && selectedNews && (
          <button 
            className="btn-secondary btn-sm" 
            onClick={handleGenerateBriefing}
            disabled={hasBriefing}
            style={hasBriefing ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
          >
            {hasBriefing ? '✓ Briefing Generado' : '⚙️ Generar Briefing'}
          </button>
        )}
        {activeWatchlist !== 'Todos' && (
          <button
            className="btn-primary btn-sm"
            onClick={createWatchlistBriefing}
            title={`Generar briefings para todos los artículos en la lista "${activeWatchlist}"`}
          >
            📋 Briefing de Lista
          </button>
        )}
      </div>

      {selectedNews ? (
        <div className="detail-card">
          <div className="detail-hero">
            <div className="detail-header-tags">
              <span className="source-large">{selectedNews.source}</span>
              <span className="date-large">
                {new Date(selectedNews.date).toLocaleString('es-ES')}
              </span>
            </div>
            <h2 className="detail-title">{selectedNews.headline}</h2>
            <div className="asset-chips">
              {selectedNews.assets && selectedNews.assets.map(symbol => (
                <span key={symbol} className="chip-large">{symbol}</span>
              ))}
            </div>
          </div>

          <ImpactBadge 
            impact={selectedNews.impact} 
            confidence={selectedNews.confidence} 
          />

          <div className="detail-body">
            <div className="detail-group">
              <h3>Resumen del Evento</h3>
              <p>{selectedNews.summary}</p>
            </div>

            <PriceComparison 
              impact={selectedNews.impact} 
              historicalComparison={selectedNews.historicalComparison} 
            />

            <HistoricalChart assets={selectedNews.assets} />

            <div className="detail-group">
              <h3>Explicación de la Señal (Evidencia)</h3>
              <p className="explanation-text">{selectedNews.explanation || 'Esperando análisis explicativo...'}</p>
              {selectedNews.evidence && (
                <div className="evidence-card">
                  <strong>Datos de Respaldo:</strong>
                  <p>{selectedNews.evidence}</p>
                </div>
              )}
            </div>

            <LegalDisclaimer />
          </div>
        </div>
      ) : (
        <div className="empty-state-card">
          <p>Selecciona una noticia para visualizar su análisis detallado de señal e impacto.</p>
        </div>
      )}
    </section>
  )
}
