import React, { useState, useEffect } from 'react'
import { useDashboard } from '../context/DashboardContext'
import StatusSelector from './StatusSelector'
import JustificationInput from './JustificationInput'
import ActionTrigger from './ActionTrigger'

export default function BriefingCard({ brief }) {
  const { updateBriefingStatus, updateBriefingJustification, toggleAlert } = useDashboard()
  const [toastMsg, setToastMsg] = useState('')

  const [localJustification, setLocalJustification] = useState(brief.justification)

  useEffect(() => {
    setLocalJustification(brief.justification)
  }, [brief.justification])

  useEffect(() => {
    const handler = setTimeout(() => {
      if (localJustification !== brief.justification) {
        updateBriefingJustification(brief.id, localJustification)
      }
    }, 500)
    return () => clearTimeout(handler)
  }, [localJustification, brief.id, brief.justification, updateBriefingJustification])

  const handleStatusChange = (newStatus) => {
    updateBriefingStatus(brief.id, newStatus)
  }

  const handleJustificationChange = (text) => {
    setLocalJustification(text)
  }

  const handleAlertTrigger = () => {
    toggleAlert(brief.id)
    if (!brief.alertCreated) {
      setToastMsg('Alerta de revisión enviada al equipo (Operación simulada segura).')
      setTimeout(() => setToastMsg(''), 3500)
    } else {
      setToastMsg('Alerta cancelada.')
      setTimeout(() => setToastMsg(''), 2000)
    }
  }

  return (
    <div className={`brief-card status-border-${brief.status.toLowerCase()}`}>
      {toastMsg && (
        <div className="toast-notification animate-fade-in-out">
          {toastMsg}
        </div>
      )}
      
      <div className="brief-card-header">
        <span className="watchlist-name">{brief.watchlist}</span>
        <span className="asset-bubble">{brief.targetAsset}</span>
      </div>

      <h4 className="brief-news-title">{brief.newsHeadline}</h4>

      <div className="brief-field">
        <strong>Movimiento Estimado:</strong>
        <p>{brief.associatedMovement}</p>
      </div>

      <div className="brief-field">
        <strong>Acción Recomendada:</strong>
        <p>{brief.suggestedAction}</p>
      </div>

      <JustificationInput
        value={localJustification}
        onChange={handleJustificationChange}
      />

      <div className="brief-actions">
        <StatusSelector
          status={brief.status}
          onChange={handleStatusChange}
        />
        
        <ActionTrigger
          alertCreated={brief.alertCreated}
          onClick={handleAlertTrigger}
        />
      </div>
    </div>
  )
}
