import React, { useState, useMemo, useEffect } from 'react'

/**
 * DECLARACIÓN DE SIMULACIÓN DE DATOS HISTÓRICOS (HACKATHON TRACK 5)
 * ------------------------------------------------------------------
 * Este componente utiliza un motor de simulación heurístico para generar
 * curvas de cotización históricas basadas en el símbolo del activo.
 * Los periodos YTD y All se computan de forma determinista para
 * garantizar consistencia visual sin realizar llamadas externas a APIs.
 */

const PERIODS = ['1M', '6M', 'YTD', '1Y', '5Y', 'All']

function generateData(symbol, period) {
  const cleanSymbol = symbol ? symbol.toUpperCase().trim() : 'NVDA'
  
  let basePrice = 100
  let trend = 'volatile'
  
  switch (cleanSymbol) {
    case 'BTC':
      basePrice = 64000
      trend = 'up'
      break
    case 'ETH':
      basePrice = 3400
      trend = 'up'
      break
    case 'NVDA':
      basePrice = 125
      trend = 'rocket'
      break
    case 'AAPL':
      basePrice = 220
      trend = 'steady-up'
      break
    case 'TSLA':
      basePrice = 250
      trend = 'volatile'
      break
    case 'US10Y':
      basePrice = 4.2
      trend = 'rates'
      break
    case 'LQD':
      basePrice = 110
      trend = 'steady-down'
      break
    case 'GLD':
      basePrice = 230
      trend = 'steady-up'
      break
    default:
      basePrice = 100
      trend = 'volatile'
  }

  const prices = []
  const seed = cleanSymbol.charCodeAt(0) + (cleanSymbol.charCodeAt(1) || 0)
  
  const random = (i) => {
    const x = Math.sin(seed + i + (period === '1M' ? 10 : period === '6M' ? 20 : period === 'YTD' ? 30 : period === '1Y' ? 40 : period === '5Y' ? 50 : 60)) * 10000
    return x - Math.floor(x)
  }

  if (period === 'YTD') {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul']
    for (let i = 0; i < months.length; i++) {
      const t = i / (months.length - 1)
      let factor = 1.0
      if (trend === 'rocket') factor = 0.8 + 0.25 * t + 0.05 * random(i)
      else if (trend === 'steady-up') factor = 0.9 + 0.12 * t + 0.02 * random(i)
      else if (trend === 'steady-down') factor = 1.0 - 0.05 * t + 0.02 * random(i)
      else if (trend === 'rates') factor = 0.95 + 0.07 * Math.sin(t * Math.PI)
      else if (trend === 'up') factor = 0.85 + 0.2 * t + 0.05 * random(i)
      else factor = 0.9 + 0.15 * random(i)

      let price = basePrice * factor
      prices.push({
        label: months[i],
        price: cleanSymbol === 'BTC' || cleanSymbol === 'ETH' ? Math.round(price) : parseFloat(price.toFixed(cleanSymbol === 'US10Y' ? 3 : 2))
      })
    }
    return prices
  }

  if (period === 'All') {
    const years = ['2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026']
    for (let i = 0; i < years.length; i++) {
      if (cleanSymbol === 'BTC') {
        const btcHist = [600, 14000, 3800, 7200, 29000, 46000, 16000, 42000, 62000, 68000, 64000]
        prices.push({ label: years[i], price: btcHist[i] })
        continue
      }
      
      if (cleanSymbol === 'ETH') {
        const ethHist = [8, 300, 130, 140, 740, 3700, 1200, 2300, 3100, 3500, 3400]
        prices.push({ label: years[i], price: ethHist[i] })
        continue
      }

      if (cleanSymbol === 'NVDA') {
        const nvdaHist = [2.0, 4.0, 3.5, 6.0, 13.0, 29.0, 14.0, 48.0, 120.0, 128.0, 125.0]
        prices.push({ label: years[i], price: nvdaHist[i] })
        continue
      }

      let factor = 1.0
      const t = i / (years.length - 1)
      if (trend === 'rocket') factor = 0.02 + 0.98 * Math.pow(t, 3) + 0.05 * random(i)
      else if (trend === 'steady-up') factor = 0.4 + 0.6 * t + 0.05 * random(i)
      else if (trend === 'steady-down') factor = 1.3 - 0.35 * t + 0.05 * random(i)
      else if (trend === 'rates') factor = 0.3 + 0.7 * Math.sin(t * Math.PI * 1.5) + 0.05 * random(i)
      else factor = 0.6 + 0.45 * random(i) + 0.25 * Math.sin(t * Math.PI * 2)

      let price = basePrice * factor
      prices.push({
        label: years[i],
        price: parseFloat(price.toFixed(cleanSymbol === 'US10Y' ? 3 : 2))
      })
    }
    return prices
  }

  let numPoints = 12
  if (period === '1M') numPoints = 15
  else if (period === '6M') numPoints = 12
  else if (period === '1Y') numPoints = 12
  else if (period === '5Y') numPoints = 10

  for (let i = 0; i < numPoints; i++) {
    let factor = 1
    const t = i / (numPoints - 1)
    
    if (trend === 'rocket') {
      if (period === '5Y') factor = 0.05 + 0.95 * Math.pow(t, 2.5)
      else if (period === '1Y') factor = 0.5 + 0.5 * Math.pow(t, 1.5) + 0.1 * random(i)
      else if (period === '6M') factor = 0.8 + 0.2 * t + 0.08 * random(i)
      else factor = 0.95 + 0.05 * t + 0.02 * random(i)
    } else if (trend === 'steady-up') {
      factor = 0.75 + 0.25 * t + 0.04 * random(i)
    } else if (trend === 'steady-down') {
      factor = 1.05 - 0.2 * t + 0.03 * random(i)
    } else if (trend === 'rates') {
      if (period === '5Y') factor = 0.3 + 0.7 * Math.sin(t * Math.PI) + 0.15 * random(i)
      else if (period === '1Y') factor = 0.9 + 0.15 * Math.cos(t * Math.PI * 1.5) + 0.05 * random(i)
      else factor = 1.0 - 0.06 * t + 0.03 * random(i)
    } else if (trend === 'up') {
      if (period === '5Y') factor = 0.2 + 0.8 * t + 0.25 * Math.sin(t * Math.PI * 2)
      else factor = 0.75 + 0.25 * t + 0.12 * Math.sin(t * Math.PI * 1.5) + 0.05 * random(i)
    } else {
      factor = 0.85 + 0.3 * random(i) + 0.1 * Math.sin(t * Math.PI * 3)
    }

    let price = basePrice * factor
    if (cleanSymbol === 'BTC' || cleanSymbol === 'ETH') {
      price = Math.round(price)
    } else if (cleanSymbol === 'US10Y') {
      price = parseFloat(price.toFixed(3))
    } else {
      price = parseFloat(price.toFixed(2))
    }
    
    let label = ''
    if (period === '1M') label = `D${Math.round(t * 30)}`
    else if (period === '6M') label = `M${Math.round(t * 6)}`
    else if (period === '1Y') {
      const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
      label = months[i % 12]
    } else if (period === '5Y') label = `'${22 + Math.floor(t * 5)}`

    prices.push({ label, price })
  }

  return prices
}

export default function HistoricalChart({ assets }) {
  const assetList = useMemo(() => {
    return assets && assets.length > 0 ? assets : ['NVDA']
  }, [assets])

  const [selectedAsset, setSelectedAsset] = useState(assetList[0])
  const [period, setPeriod] = useState('1Y')
  const [hoveredPoint, setHoveredPoint] = useState(null)

  useEffect(() => {
    if (assetList.length > 0) {
      setSelectedAsset(assetList[0])
    }
  }, [assetList])

  const chartData = useMemo(() => {
    return generateData(selectedAsset, period)
  }, [selectedAsset, period])

  const startPrice = chartData[0].price
  const endPrice = chartData[chartData.length - 1].price
  const priceDiff = endPrice - startPrice
  const percentChange = ((priceDiff / startPrice) * 100).toFixed(2)
  const isPositive = priceDiff >= 0

  const pricesOnly = chartData.map(d => d.price)
  const minPrice = Math.min(...pricesOnly)
  const maxPrice = Math.max(...pricesOnly)
  const baseRange = maxPrice - minPrice || 1

  // Use common boundaries with 5% padding on top and bottom, rounded to integers
  const padFactor = 0.05
  const padding = baseRange * padFactor
  const chartMax = Math.ceil(maxPrice + padding)
  const chartMin = Math.max(0, Math.floor(minPrice - padding))
  const chartRange = chartMax - chartMin

  // SVG coordinate systems: width 500, height 200
  // Left margin 65 (for Y labels), Right margin 15, Top margin 15, Bottom margin 30
  // Plotting area: X from 65 to 485 (width 420), Y from 15 to 170 (height 155)
  const points = chartData.map((d, index) => {
    const x = 65 + (index / (chartData.length - 1)) * 420
    const y = 170 - ((d.price - chartMin) / chartRange) * 155
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')

  const color = isPositive ? 'var(--color-positive, #10b981)' : 'var(--color-negative, #ef4444)'
  const glowId = `hist-glow-${selectedAsset}-${period}`

  const formatPrice = (val) => {
    if (selectedAsset === 'US10Y') return `${val.toFixed(2)}%`
    return `$${val.toLocaleString('es-ES', { minimumFractionDigits: selectedAsset === 'BTC' || selectedAsset === 'ETH' ? 0 : 2 })}`
  }

  // Axis labels always use round integers
  const formatAxisPrice = (val) => {
    if (selectedAsset === 'US10Y') return `${Math.round(val * 100) / 100}%`
    const rounded = Math.round(val)
    if (rounded >= 1000) return `$${(rounded / 1000).toFixed(0)}k`
    return `$${rounded.toLocaleString('es-ES')}`
  }

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
    const totalPoints = chartData.length
    let closestIndex = Math.round((percentX / 100) * (totalPoints - 1))
    closestIndex = Math.max(0, Math.min(totalPoints - 1, closestIndex))

    const currentVal = chartData[closestIndex].price
    const relativeGrowth = (((currentVal - startPrice) / startPrice) * 100).toFixed(2)

    setHoveredPoint({
      ...chartData[closestIndex],
      index: closestIndex,
      growth: relativeGrowth,
      x: 65 + (closestIndex / (totalPoints - 1)) * 420,
      y: 170 - ((currentVal - chartMin) / chartRange) * 155
    })
  }

  const handleMouseLeave = () => {
    setHoveredPoint(null)
  }

  return (
    <div className="detail-group highlight-box historical-chart-group">
      <div className="historical-chart-header">
        <div className="chart-info">
          <h3>Valor Histórico de Activo</h3>
          <div className="chart-ticker-selector">
            {assetList.length > 1 ? (
              <div className="selector-tabs">
                {assetList.map(symbol => (
                  <button
                    key={symbol}
                    className={`tab-btn ${selectedAsset === symbol ? 'active' : ''}`}
                    onClick={() => setSelectedAsset(symbol)}
                  >
                    {symbol}
                  </button>
                ))}
              </div>
            ) : (
              <span className="ticker-label-static">{selectedAsset}</span>
            )}
          </div>
          
          <div className="price-summary">
            {hoveredPoint ? (
              <>
                <span className="price-value">{formatPrice(hoveredPoint.price)}</span>
                <span className={`price-trend ${parseFloat(hoveredPoint.growth) >= 0 ? 'trend-up' : 'trend-down'}`}>
                  {parseFloat(hoveredPoint.growth) >= 0 ? '▲' : '▼'} {Math.abs(parseFloat(hoveredPoint.growth))}% (desde inicio)
                </span>
                <span className="hover-time-text">{hoveredPoint.label}</span>
              </>
            ) : (
              <>
                <span className="price-value">{formatPrice(endPrice)}</span>
                <span className={`price-trend ${isPositive ? 'trend-up' : 'trend-down'}`}>
                  {isPositive ? '▲' : '▼'} {Math.abs(percentChange)}% ({period})
                </span>
              </>
            )}
          </div>
        </div>
        
        <div className="period-tabs">
          {PERIODS.map(p => (
            <button
              key={p}
              className={`period-btn ${period === p ? 'active' : ''}`}
              onClick={() => setPeriod(p)}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="historical-chart-body">
        <div className="trend-chart-container interactive-chart">
          <svg
            viewBox="0 0 500 210"
            className="trend-svg"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <defs>
              <linearGradient id={glowId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity="0.22" />
                <stop offset="100%" stopColor={color} stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid Lines */}
            <line x1="65" y1="15" x2="485" y2="15" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="3,3" />
            <line x1="65" y1="92" x2="485" y2="92" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="3,3" />
            <line x1="65" y1="170" x2="485" y2="170" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="3,3" />
            
            <line x1="65" y1="15" x2="65" y2="170" stroke="#1e293b" strokeWidth="0.5" />
            <line x1="485" y1="15" x2="485" y2="170" stroke="#1e293b" strokeWidth="0.5" />

            {/* Y Axis Labels (Rounded integer limits) */}
            <text x="58" y="18" fill="var(--text-muted)" fontSize="8.5" textAnchor="end" alignmentBaseline="middle">{formatAxisPrice(chartMax)}</text>
            <text x="58" y="92" fill="var(--text-muted)" fontSize="8.5" textAnchor="end" alignmentBaseline="middle">{formatAxisPrice(chartMin + chartRange / 2)}</text>
            <text x="58" y="167" fill="var(--text-muted)" fontSize="8.5" textAnchor="end" alignmentBaseline="middle">{formatAxisPrice(chartMin)}</text>

            {/* X Axis Labels inside SVG (Perfect responsive alignment) */}
            <text x="65" y="193" fill="var(--text-muted)" fontSize="8.5" textAnchor="start">{chartData[0].label}</text>
            <text x="275" y="193" fill="var(--text-muted)" fontSize="8.5" textAnchor="middle">{chartData[Math.floor(chartData.length / 2)].label}</text>
            <text x="485" y="193" fill="var(--text-muted)" fontSize="8.5" textAnchor="end">{chartData[chartData.length - 1].label}</text>

            {/* Area fill */}
            <path
              d={`M 65,170 L 65,${points.split(' ')[0].split(',')[1]} L ${points.replaceAll(' ', ' L ')} L 485,170 Z`}
              fill={`url(#${glowId})`}
            />

            {/* Price Line */}
            <polyline
              fill="none"
              stroke={color}
              strokeWidth="2"
              points={points}
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Hover Guides */}
            {hoveredPoint && (
              <>
                {/* Vertical Dotted Guide */}
                <line
                  x1={hoveredPoint.x}
                  y1="15"
                  x2={hoveredPoint.x}
                  y2="170"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="0.75"
                  strokeDasharray="2,2"
                />
                {/* Horizontal Dotted Guide */}
                <line
                  x1="65"
                  y1={hoveredPoint.y}
                  x2="485"
                  y2={hoveredPoint.y}
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="0.75"
                  strokeDasharray="2,2"
                />
                {/* Perfectly Round Glowing dot */}
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
    </div>
  )
}
