import React from 'react'

export default function PriceComparison({ historicalComparison }) {
  return (
    <div className="detail-group highlight-box">
      <h3>Comparativa Histórica</h3>
      <p className="comparison-text">
        {historicalComparison || 'Sin correlación histórica calculada para esta señal.'}
      </p>
    </div>
  )
}
