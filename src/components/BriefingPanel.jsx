import React, { useMemo, useState } from 'react'
import { useDashboard } from '../context/DashboardContext'
import BriefingCard from './BriefingCard'
import ConsolidatedReportModal from './ConsolidatedReportModal'
import { llmService } from '../services/llmService'

export default function BriefingPanel() {
  const { briefings, activeWatchlist, watchlists } = useDashboard()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [reportText, setReportText] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const filteredBriefings = useMemo(() => {
    if (!activeWatchlist || activeWatchlist === 'Todos') return briefings
    const watchlistObj = watchlists.find(w => w.name === activeWatchlist)
    if (!watchlistObj) return briefings
    return briefings.filter(b => watchlistObj.assets.includes(b.targetAsset))
  }, [briefings, activeWatchlist, watchlists])

  const handleGenerateReport = async () => {
    if (filteredBriefings.length === 0) return
    setIsGenerating(true)
    setIsModalOpen(true)
    setReportText('')
    try {
      const digestText = await llmService.generateConsolidatedReport(filteredBriefings, activeWatchlist)
      setReportText(digestText)
    } catch (e) {
      console.error("Failed to generate consolidated report:", e)
      setReportText('Ocurrió un error al generar el reporte con la IA de Gemini.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <section className="briefing-section">
      <div className="section-header">
        <div>
          <h2>Briefing y Revisión Humana</h2>
          <span className="count-badge bg-purple">{filteredBriefings.length} Reportes</span>
        </div>
        {filteredBriefings.length > 0 && (
          <button 
            className="btn-secondary btn-sm" 
            onClick={handleGenerateReport}
            title="Generar reporte macro consolidado con IA"
          >
            ✨ Reporte de IA
          </button>
        )}
      </div>

      <div className="briefing-list">
        {filteredBriefings.length === 0 ? (
          <div className="empty-state">
            <p>No hay reportes de briefing generados en este momento.</p>
          </div>
        ) : (
          filteredBriefings.map((brief) => (
            <BriefingCard key={brief.id} brief={brief} />
          ))
        )}
      </div>

      <ConsolidatedReportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        reportText={reportText}
        watchlistName={activeWatchlist}
      />
    </section>
  )
}
