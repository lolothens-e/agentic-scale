import React, { useState, useMemo } from 'react'

/**
 * DECLARACIÓN DE SIMULACIÓN DE PROYECCIÓN DE IMPACTO (HACKATHON TRACK 5)
 * ---------------------------------------------------------------------
 * Este componente utiliza curvas matemáticas deterministas para proyectar
 * el impacto del evento a corto plazo (de T-2 días a T+2 días).
 * Los datos son simulados localmente y declarados como curvas de tendencia
 * alcistas, bajistas o estables basadas en el impacto estimado.
 */

export default function PriceComparison({ impact, historicalComparison }) {
  const isPositive = impact === 'Positivo'
  const isNegative = impact === 'Negativo'
  const [hoveredPoint, setHoveredPoint] = useState(null)

  // Chart data stops
  const stopsData = useMemo(() => {
    if (isPositive) {
      return [
        { label: 'T - 2d', priceIndex: 100.0, percent: '0.00%' },
        { label: 'T - 1d', priceIndex: 100.8, percent: '+0.80%' },
        { label: 'Evento', priceIndex: 102.1, percent: '+2.10%' },
        { label: 'T + 1d', priceIndex: 104.5, percent: '+4.50%' },
        { label: 'T + 2d', priceIndex: 106.2, percent: '+6.20%' }
      ]
    } else if (isNegative) {
      return [
        { label: 'T - 2d', priceIndex: 100.0, percent: '0.00%' },
        { label: 'T - 1d', priceIndex: 98.5, percent: '-1.50%' },
        { label: 'Evento', priceIndex: 97.2, percent: '-2.80%' },
        { label: 'T + 1d', priceIndex: 94.8, percent: '-5.20%' },
        { label: 'T + 2d', priceIndex: 92.1, percent: '-7.90%' }
      ]
    } else {
      return [
        { label: 'T - 2d', priceIndex: 100.0, percent: '0.00%' },
        { label: 'T - 1d', priceIndex: 100.2, percent: '+0.20%' },
        { label: 'Evento', priceIndex: 99.8, percent: '-0.20%' },
        { label: 'T + 1d', priceIndex: 100.3, percent: '+0.30%' },
        { label: 'T + 2d', priceIndex: 100.1, percent: '+0.10%' }
      ]
    }
  }, [isPositive, isNegative])

  const minVal = Math.min(...stopsData.map(d => d.priceIndex))
  const maxVal = Math.max(...stopsData.map(d => d.priceIndex))
  const baseRange = maxVal - minVal || 1

  // Use common boundaries with 5% padding, rounded to 1dp
  const padFactor = 0.05
  const padding = baseRange * padFactor
  const chartMax = Math.ceil((maxVal + padding) * 10) / 10
  const chartMin = Math.floor((minVal - padding) * 10) / 10
  const chartRange = chartMax - chartMin

  // SVG coordinate systems: width 500, height 200
  // Left margin 65 (for Y labels), Right margin 15, Top margin 15, Bottom margin 30
  // Plotting area: X from 65 to 485 (width 420), Y from 15 to 170 (height 155)
  const points = stopsData.map((d, index) => {
    const x = 65 + (index / (stopsData.length - 1)) * 420
    const y = 170 - ((d.priceIndex - chartMin) / chartRange) * 155
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')

  let color = "var(--color-neutral)"
  let badgeText = "■ Lateral / Estable"

  if (isPositive) {
    color = "var(--color-positive)"
    badgeText = "▲ Alza Esperada"
  } else if (isNegative) {
    color = "var(--color-negative)"
    badgeText = "▼ Corrección"
  }

  // Handle Mouse Hover Event on SVG to track coordinate stops
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const clientX = e.clientX - rect.left

    // Scale client coords to SVG viewBox coords (500 wide)
    const svgX = (clientX / rect.width) * 500
    const chartRelativeX = svgX - 65

    if (chartRelativeX < -10 || chartRelativeX > 430) {
      setHoveredPoint(null)
      return
    }

    const percentX = Math.max(0, Math.min(100, (chartRelativeX / 420) * 100))
    const totalPoints = stopsData.length
    let closestIndex = Math.round((percentX / 100) * (totalPoints - 1))
    closestIndex = Math.max(0, Math.min(totalPoints - 1, closestIndex))

    const d = stopsData[closestIndex]

    setHoveredPoint({
      ...d,
      index: closestIndex,
      x: 65 + (closestIndex / (totalPoints - 1)) * 420,
      y: 170 - ((d.priceIndex - chartMin) / chartRange) * 155
    })
  }

  const handleMouseLeave = () => {
    setHoveredPoint(null)
  }

  // Axis labels use 1dp for cleaner display
  const formatAxisPercent = (val) => {
    const change = val - 100.0
    if (Math.abs(change) < 0.05) return '0%'
    return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`
  }

  // Event dot coordinates (X=275 is index 2)
  const eventY = 170 - ((stopsData[2].priceIndex - chartMin) / chartRange) * 155

  return (
    <div className="detail-group highlight-box price-comparison-group">
      <div className="comparison-header">
        <div className="title-section">
          <h3>Comparativa Proyectada a Corto Plazo</h3>
          {hoveredPoint ? (
            <div className="hover-stats-inline">
              <span className="hover-time-text">{hoveredPoint.label}: </span>
              <span className="hover-growth-val" style={{ color: color }}>{hoveredPoint.percent}</span>
            </div>
          ) : (
            <span className="trend-badge" style={{ color: color, borderColor: color }}>
              {badgeText}
            </span>
          )}
        </div>
      </div>
      
      <p className="comparison-text">
        {historicalComparison || 'Sin correlación histórica calculada para esta señal.'}
      </p>
      
      {/* Visual SVG Trend Chart */}
      <div className="trend-chart-container interactive-chart">
        <svg
          viewBox="0 0 500 210"
          className="trend-svg"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <defs>
            <linearGradient id={`chart-glow-${impact}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={color} stopOpacity="0.0" />
            </linearGradient>
          </defs>
          
          {/* Grid lines */}
          <line x1="65" y1="15" x2="485" y2="15" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="3,3" />
          <line x1="65" y1="92" x2="485" y2="92" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="3,3" />
          <line x1="65" y1="170" x2="485" y2="170" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="3,3" />
          
          <line x1="65" y1="15" x2="65" y2="170" stroke="#1e293b" strokeWidth="0.5" />
          <line x1="485" y1="15" x2="485" y2="170" stroke="#1e293b" strokeWidth="0.5" />

          <line x1="170" y1="15" x2="170" y2="170" stroke="#1e293b" strokeWidth="0.35" strokeDasharray="3,3" />
          <line x1="275" y1="15" x2="275" y2="170" stroke="#1e293b" strokeWidth="0.5" />
          <line x1="380" y1="15" x2="380" y2="170" stroke="#1e293b" strokeWidth="0.35" strokeDasharray="3,3" />

          {/* Y Axis Labels (Relative change, rounded) */}
          <text x="58" y="18" fill="var(--text-muted)" fontSize="8.5" textAnchor="end" alignmentBaseline="middle">{formatAxisPercent(chartMax)}</text>
          <text x="58" y="92" fill="var(--text-muted)" fontSize="8.5" textAnchor="end" alignmentBaseline="middle">{formatAxisPercent(chartMin + chartRange / 2)}</text>
          <text x="58" y="167" fill="var(--text-muted)" fontSize="8.5" textAnchor="end" alignmentBaseline="middle">{formatAxisPercent(chartMin)}</text>

          {/* X Axis Labels inside SVG (Perfect responsive alignment) */}
          <text x="65" y="193" fill="var(--text-muted)" fontSize="8.5" textAnchor="start">T - 2d</text>
          <text x="275" y="193" fill="var(--text-muted)" fontSize="8.5" textAnchor="middle">Evento</text>
          <text x="485" y="193" fill="var(--text-muted)" fontSize="8.5" textAnchor="end">T + 2d</text>
          
          {/* Area fill */}
          <path 
            d={`M 65,170 L 65,${points.split(' ')[0].split(',')[1]} L ${points.replaceAll(' ', ' L ')} L 485,170 Z`} 
            fill={`url(#chart-glow-${impact})`} 
          />
          
          {/* Trend line */}
          <polyline
            fill="none"
            stroke={color}
            strokeWidth="2.2"
            points={points}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Event point marker (Announce) */}
          <circle cx="275" cy={eventY} r="3.5" fill="#ffffff" stroke={color} strokeWidth="1.5" />

          {/* Hover indicator lines and dot */}
          {hoveredPoint && (
            <>
              {/* Vertical Guide line */}
              <line
                x1={hoveredPoint.x}
                y1="15"
                x2={hoveredPoint.x}
                y2="170"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="0.75"
                strokeDasharray="2,2"
              />
              {/* Horizontal Guide line */}
              <line
                x1="65"
                y1={hoveredPoint.y}
                x2="485"
                y2={hoveredPoint.y}
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="0.75"
                strokeDasharray="2,2"
              />
              {/* Active Dot */}
              <circle
                cx={hoveredPoint.x}
                cy={hoveredPoint.y}
                r="4"
                fill="#ffffff"
                stroke={color}
                strokeWidth="2"
              />
            </>
          )}
        </svg>
      </div>
    </div>
  )
}
