import React, { useState, useMemo, useEffect } from 'react'

const PERIODS = ['1M', '6M', '1Y', '5Y']

// Generate deterministic mock price curves for assets
function generateData(symbol, period) {
  const cleanSymbol = symbol ? symbol.toUpperCase().trim() : 'NVDA'
  
  let basePrice = 100
  let trend = 'volatile' // 'up', 'down', 'rocket', 'steady-up', 'steady-down', 'rates'
  
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

  let numPoints = 12
  if (period === '1M') {
    numPoints = 15
  } else if (period === '6M') {
    numPoints = 12
  } else if (period === '1Y') {
    numPoints = 12
  } else if (period === '5Y') {
    numPoints = 10
  }

  const prices = []
  const seed = cleanSymbol.charCodeAt(0) + (cleanSymbol.charCodeAt(1) || 0)
  
  // Seeded random number generator for stable curves
  const random = (i) => {
    const x = Math.sin(seed + i + (period === '1M' ? 1 : period === '6M' ? 2 : period === '1Y' ? 3 : 4)) * 10000
    return x - Math.floor(x)
  }

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
    if (period === '1M') {
      label = `D${Math.round(t * 30)}`
    } else if (period === '6M') {
      label = `M${Math.round(t * 6)}`
    } else if (period === '1Y') {
      const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
      label = months[i % 12]
    } else if (period === '5Y') {
      label = `'${22 + Math.floor(t * 5)}`
    }

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
  const range = maxPrice - minPrice || 1

  const points = chartData.map((d, index) => {
    const x = (index / (chartData.length - 1)) * 100
    const y = 85 - ((d.price - minPrice) / range) * 70
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')

  const color = isPositive ? 'var(--color-positive, #10b981)' : 'var(--color-negative, #ef4444)'
  const glowId = `hist-glow-${selectedAsset}-${period}`

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
            <span className="price-value">
              {selectedAsset === 'US10Y' ? `${endPrice}%` : `$${endPrice.toLocaleString('es-ES')}`}
            </span>
            <span className={`price-trend ${isPositive ? 'trend-up' : 'trend-down'}`}>
              {isPositive ? '▲' : '▼'} {Math.abs(percentChange)}% ({period})
            </span>
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
        <div className="trend-chart-container">
          <svg viewBox="0 0 100 100" className="trend-svg" preserveAspectRatio="none">
            <defs>
              <linearGradient id={glowId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity="0.25" />
                <stop offset="100%" stopColor={color} stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid Lines */}
            <line x1="0" y1="15" x2="100" y2="15" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="3,3" />
            <line x1="0" y1="50" x2="100" y2="50" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="3,3" />
            <line x1="0" y1="85" x2="100" y2="85" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="3,3" />

            {/* Area fill */}
            <path
              d={`M 0,100 L 0,${points.split(' ')[0].split(',')[1]} L ${points.replaceAll(' ', ' L ')} L 100,100 Z`}
              fill={`url(#${glowId})`}
            />

            {/* Price Line */}
            <polyline
              fill="none"
              stroke={color}
              strokeWidth="2.2"
              points={points}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="chart-labels">
            <span>{chartData[0].label}</span>
            <span>{chartData[Math.floor(chartData.length / 2)].label}</span>
            <span>{chartData[chartData.length - 1].label}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
