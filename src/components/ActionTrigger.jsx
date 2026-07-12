import React from 'react'

export default function ActionTrigger({ alertCreated, onClick }) {
  return (
    <button
      className={`btn-alert ${alertCreated ? 'active' : ''}`}
      onClick={onClick}
      title={alertCreated ? "Alerta creada para revisión humana" : "Crear alerta de revisión"}
    >
      {alertCreated ? '🔔 Alerta Lista' : '🔕 Crear Alerta'}
    </button>
  )
}
