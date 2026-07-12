import React from 'react'

export default function PriceComparison({ impact, historicalComparison }) {
  const isPositive = impact === 'Positivo'
  const isNegative = impact === 'Negativo'
  
  // Custom SVG path points based on impact type
  let points = "0,65 25,60 50,65 75,55 100,60" // default neutral
  let color = "var(--color-neutral)"
  let glowColor = "rgba(245, 158, 11, 0.15)"

  if (isPositive) {
    points = "0,70 25,65 50,55 75,35 100,15" // upward trend
    color = "var(--color-positive)"
    glowColor = "rgba(16, 185, 129, 0.15)"
  } else if (isNegative) {
    points = "0,25 25,40 50,45 75,65 100,85" // downward trend
    color = "var(--color-negative)"
    glowColor = "rgba(239, 68, 68, 0.15)"
  }

  // Get y-coordinate for the event marker (third point, index 2 in points string)
  const eventY = points.split(' ')[2].split(',')[1]

  return (
    <div className="detail-group highlight-box price-comparison-group">
      <div className="comparison-header">
        <h3>Comparativa Histórica y Rendimiento</h3>
        <span className="trend-badge" style={{ color: color, borderColor: color }}>
          {isPositive ? '▲ Alza Esperada' : isNegative ? '▼ Corrección' : '■ Lateral / Estable'}
        </span>
      </div>
      
      <p className="comparison-text">
        {historicalComparison || 'Sin correlación histórica calculada para esta señal.'}
      </p>
      
      {/* Visual SVG Trend Chart */}
      <div className="trend-chart-container">
        <svg viewBox="0 0 100 100" className="trend-svg" preserveAspectRatio="none">
          <defs>
            <linearGradient id={`chart-glow-${impact}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0.0" />
            </linearGradient>
          </defs>
          
          {/* Grid lines */}
          <line x1="0" y1="25" x2="100" y2="25" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="3,3" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="3,3" />
          <line x1="0" y1="75" x2="100" y2="75" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="3,3" />
          
          <line x1="25" y1="0" x2="25" y2="100" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="3,3" />
          <line x1="50" y1="0" x2="50" y2="100" stroke="#1e293b" strokeWidth="0.75" />
          <line x1="75" y1="0" x2="75" y2="100" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="3,3" />
          
          {/* Area fill */}
          <path 
            d={`M 0,100 L 0,${points.split(' ')[0].split(',')[1]} L ${points.replaceAll(' ', ' L ')} L 100,100 Z`} 
            fill={`url(#chart-glow-${impact})`} 
          />
          
          {/* Trend line */}
          <polyline
            fill="none"
            stroke={color}
            strokeWidth="2.5"
            points={points}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ filter: `drop-shadow(0px 3px 4px ${glowColor})` }}
          />

          {/* Event point marker (Announce) */}
          <circle cx="50" cy={eventY} r="3.5" fill="#ffffff" stroke={color} strokeWidth="1.5" />
        </svg>
        <div className="chart-labels">
          <span>T - 2d</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>Evento</span>
          <span>T + 2d</span>
        </div>
      </div>
    </div>
  )
}
