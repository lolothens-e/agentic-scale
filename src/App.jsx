import React, { useState } from 'react'
import { DashboardProvider, useDashboard } from './context/DashboardContext'
import NewsSidebar from './components/NewsSidebar'
import ImpactDetail from './components/ImpactDetail'
import BriefingPanel from './components/BriefingPanel'
import './App.css'

function AppContent() {
  const { addNewsItem, selectNews } = useDashboard()
  const [showAddNewsModal, setShowAddNewsModal] = useState(false)
  const [newNewsForm, setNewNewsForm] = useState({
    headline: '',
    source: 'Bloomberg',
    summary: '',
    assetsString: 'NVDA, BTC',
    impact: 'Positivo',
    confidence: '80',
    historicalComparison: '',
    explanation: '',
    evidence: '',
  })

  const handleCreateNews = (e) => {
    e.preventDefault()
    const assets = newNewsForm.assetsString
      .split(',')
      .map((s) => s.trim().toUpperCase())
      .filter(Boolean)

    const newEntry = {
      id: `news-${Date.now()}`,
      headline: newNewsForm.headline || 'Untitled Market Update',
      source: newNewsForm.source,
      date: new Date().toISOString(),
      assets,
      summary: newNewsForm.summary || 'No summary details provided.',
      historicalComparison: newNewsForm.historicalComparison || '',
      impact: newNewsForm.impact,
      confidence: parseInt(newNewsForm.confidence) || 80,
      explanation: newNewsForm.explanation || '',
      evidence: newNewsForm.evidence || '',
    }

    addNewsItem(newEntry)
    selectNews(newEntry.id)
    setShowAddNewsModal(false)

    // Reset form
    setNewNewsForm({
      headline: '',
      source: 'Bloomberg',
      summary: '',
      assetsString: 'NVDA, BTC',
      impact: 'Positivo',
      confidence: '80',
      historicalComparison: '',
      explanation: '',
      evidence: '',
    })
  }

  return (
    <div className="dashboard-container">
      {/* Top Banner / Nav */}
      <header className="main-header">
        <div className="brand">
          <div className="logo-icon">▲</div>
          <div>
            <h1>ScaleAgents</h1>
            <p className="subtitle">Track 5: Inteligencia de Mercado y Recomendaciones Financieras</p>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => setShowAddNewsModal(true)}>
            + Simular Noticia
          </button>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="grid-layout">
        {/* Left Column: News Feed & Filters */}
        <NewsSidebar />

        {/* Center Column: Explainable Impact Signal */}
        <ImpactDetail />

        {/* Right Column: Briefing de Mercado & Human Review */}
        <BriefingPanel />
      </div>

      {/* Add News Modal Simulation */}
      {showAddNewsModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Simular Nueva Noticia y Señal</h2>
              <button className="close-modal" onClick={() => setShowAddNewsModal(false)}>×</button>
            </div>
            <form onSubmit={handleCreateNews}>
              <div className="form-group">
                <label>Titular de la Noticia</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Apple Lanza Nuevo Microprocesador Producido con TSMC"
                  value={newNewsForm.headline}
                  onChange={(e) => setNewNewsForm({ ...newNewsForm, headline: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Fuente</label>
                  <select
                    value={newNewsForm.source}
                    onChange={(e) => setNewNewsForm({ ...newNewsForm, source: e.target.value })}
                  >
                    <option value="Bloomberg">Bloomberg</option>
                    <option value="Reuters">Reuters</option>
                    <option value="Financial Times">Financial Times</option>
                    <option value="WSJ">Wall Street Journal</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Activos Relacionados (Separados por coma)</label>
                  <input
                    type="text"
                    placeholder="AAPL, NVDA"
                    value={newNewsForm.assetsString}
                    onChange={(e) => setNewNewsForm({ ...newNewsForm, assetsString: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Impacto</label>
                  <select
                    value={newNewsForm.impact}
                    onChange={(e) => setNewNewsForm({ ...newNewsForm, impact: e.target.value })}
                  >
                    <option value="Positivo">Positivo</option>
                    <option value="Negativo">Negativo</option>
                    <option value="Neutral">Neutral</option>
                    <option value="Incierto">Incierto</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Confianza (%)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={newNewsForm.confidence}
                    onChange={(e) => setNewNewsForm({ ...newNewsForm, confidence: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Resumen de la Noticia</label>
                <textarea
                  rows="2"
                  placeholder="Resumen del acontecimiento..."
                  value={newNewsForm.summary}
                  onChange={(e) => setNewNewsForm({ ...newNewsForm, summary: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Comparativa Histórica</label>
                <input
                  type="text"
                  placeholder="ej. Históricamente, eventos similares elevan el volumen un 20%..."
                  value={newNewsForm.historicalComparison}
                  onChange={(e) => setNewNewsForm({ ...newNewsForm, historicalComparison: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Explicación & Evidencia</label>
                <textarea
                  rows="2"
                  placeholder="Evidencia de mercado e hipótesis detrás del impacto..."
                  value={newNewsForm.explanation}
                  onChange={(e) => setNewNewsForm({ ...newNewsForm, explanation: e.target.value })}
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowAddNewsModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Inyectar Noticia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default function App() {
  return (
    <DashboardProvider>
      <AppContent />
    </DashboardProvider>
  )
}
