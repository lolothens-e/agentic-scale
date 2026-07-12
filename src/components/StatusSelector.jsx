import React from 'react'

export default function StatusSelector({ status, onChange }) {
  const statusClass = `status-select ${status.toLowerCase()}`

  return (
    <div className="status-selector">
      <label>Estado:</label>
      <select
        value={status}
        onChange={(e) => onChange(e.target.value)}
        className={statusClass}
      >
        <option value="Pendiente">Pendiente</option>
        <option value="Revisada">Revisada</option>
        <option value="Escalada">Escalada</option>
        <option value="Descartada">Descartada</option>
      </select>
    </div>
  )
}
