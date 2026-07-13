import React, { useState } from 'react'

function parseInlineStyles(text) {
  if (!text) return ''
  const boldParts = text.split('**')
  return boldParts.map((boldPart, i) => {
    const isBold = i % 2 === 1
    const italicParts = boldPart.split('*')
    const innerContent = italicParts.map((italicPart, j) => {
      const isItalic = j % 2 === 1
      if (isItalic) {
        return <em key={j}>{italicPart}</em>
      }
      return italicPart
    })
    
    if (isBold) {
      return <strong key={i}>{innerContent}</strong>
    }
    return <span key={i}>{innerContent}</span>
  })
}

export default function ConsolidatedReportModal({ isOpen, onClose, reportText, watchlistName }) {
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const handleCopy = () => {
    navigator.clipboard.writeText(reportText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="modal-backdrop show">
      <div className="modal-content report-modal">
        <div className="modal-header">
          <div>
            <h2>Reporte Consolidado de IA</h2>
            <p className="modal-subtitle">Lista de seguimiento: {watchlistName}</p>
          </div>
          <button className="close-modal" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body report-body">
          {reportText ? (
            <div className="report-markdown">
              {reportText.split('\n').map((line, idx) => {
                const trimmed = line.trim()
                if (line.startsWith('# ')) {
                  return <h1 key={idx}>{parseInlineStyles(line.substring(2))}</h1>
                } else if (line.startsWith('## ')) {
                  return <h2 key={idx}>{parseInlineStyles(line.substring(3))}</h2>
                } else if (line.startsWith('### ')) {
                  return <h3 key={idx}>{parseInlineStyles(line.substring(4))}</h3>
                } else if (line.startsWith('* ') || line.startsWith('- ')) {
                  return <li key={idx} style={{ marginLeft: '20px', marginBlock: '4px' }}>{parseInlineStyles(line.substring(2))}</li>
                } else if (line.startsWith('  - ') || line.startsWith('  * ')) {
                  return <li key={idx} style={{ marginLeft: '40px', marginBlock: '4px', listStyleType: 'circle' }}>{parseInlineStyles(line.substring(4))}</li>
                } else if (trimmed.startsWith('---')) {
                  return <hr key={idx} style={{ border: '0', borderTop: '1px solid var(--border-color)', marginBlock: '15px' }} />
                } else if (trimmed === '') {
                  return <div key={idx} style={{ height: '10px' }} />
                } else {
                  return <p key={idx}>{parseInlineStyles(line)}</p>
                }
              })}
            </div>
          ) : (
            <div className="loading-report">
              <div className="spinner"></div>
              <p>Gemini está procesando y consolidando los briefings...</p>
            </div>
          )}
        </div>

        <div className="form-actions report-actions">
          {reportText && (
            <button className="btn-secondary" onClick={handleCopy}>
              {copied ? '¡Copiado!' : '📋 Copiar Reporte'}
            </button>
          )}
          <button className="btn-primary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
