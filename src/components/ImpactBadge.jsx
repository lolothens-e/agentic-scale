import React from 'react'

export default function ImpactBadge({ impact, confidence }) {
  const lowercaseImpact = impact ? impact.toLowerCase() : 'neutral'
  const textClass = `metric-value impact-text-${lowercaseImpact}`

  return (
    <div className="metrics-row">
      <div className="metric-box">
        <span className="metric-label">Dirección del Impacto</span>
        <span className={textClass}>
          {impact || 'Neutral'}
        </span>
      </div>
      <div className="metric-box">
        <span className="metric-label">Nivel de Confianza</span>
        <span className="metric-value text-blue">{confidence || 0}%</span>
      </div>
    </div>
  )
}
