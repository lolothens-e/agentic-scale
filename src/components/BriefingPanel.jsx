import React from 'react'
import { useDashboard } from '../context/DashboardContext'
import BriefingCard from './BriefingCard'

export default function BriefingPanel() {
  const { briefings } = useDashboard()

  return (
    <section className="briefing-section">
      <div className="section-header">
        <h2>Briefing y Revisión Humana</h2>
        <span className="count-badge bg-purple">{briefings.length} Reportes</span>
      </div>

      <div className="briefing-list">
        {briefings.length === 0 ? (
          <div className="empty-state">
            <p>No hay reportes de briefing generados en este momento.</p>
          </div>
        ) : (
          briefings.map((brief) => (
            <BriefingCard key={brief.id} brief={brief} />
          ))
        )}
      </div>
    </section>
  )
}
