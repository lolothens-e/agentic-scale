import React from 'react'

export default function JustificationInput({ value, onChange }) {
  return (
    <div className="brief-field justification-input-field">
      <label>Justificación del Analista:</label>
      <textarea
        placeholder="Escribe la justificación o notas adicionales sobre esta señal..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
