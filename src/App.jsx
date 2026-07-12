<<<<<<< HEAD
import React, { useState, useMemo, useEffect } from 'react'
=======
import React, { useState } from 'react'
import { DashboardProvider, useDashboard } from './context/DashboardContext'
import NewsSidebar from './components/NewsSidebar'
import ImpactDetail from './components/ImpactDetail'
import BriefingPanel from './components/BriefingPanel'
>>>>>>> origin/main
import './App.css'
import { useMarketNews } from './hooks/useMarketNews'

<<<<<<< HEAD
// Initial Mock Data
const INITIAL_ASSETS = [
  { symbol: 'NVDA', name: 'NVIDIA Corp.', type: 'Acciones' },
  { symbol: 'TSLA', name: 'Tesla Inc.', type: 'Acciones' },
  { symbol: 'AAPL', name: 'Apple Inc.', type: 'Acciones' },
  { symbol: 'BTC', name: 'Bitcoin', type: 'Criptoactivos' },
  { symbol: 'ETH', name: 'Ethereum', type: 'Criptoactivos' },
  { symbol: 'US10Y', name: 'US 10-Year Treasury', type: 'Instrumentos de crédito' },
  { symbol: 'LQD', name: 'iShares Corporate Bond ETF', type: 'Instrumentos de crédito' },
  { symbol: 'GLD', name: 'SPDR Gold Shares', type: 'Otros' },
]

const INITIAL_NEWS = [
  {
    id: 'news-1',
    headline: 'US Treasury Yields Drop as Inflation Cools More Than Expected',
    source: 'Bloomberg',
    date: '2026-07-11T14:30:00Z',
    assets: ['US10Y', 'LQD'],
    summary: 'Consumer price index rose 0.1% last month, supporting expectations for potential rate cuts by the Federal Reserve. Bond prices rallied as yields decreased.',
    historicalComparison: 'Historically, cooled inflation CPI prints correlate with a +1.2% average rise in 10Y Bond prices and a 15 bps drop in yield over the following 3 days.',
    impact: 'Positivo',
    confidence: 88,
    explanation: 'Lower inflation expectations decrease the probability of higher interest rates. This is directly supportive for bond valuations (credit instruments) and reduces borrowing costs.',
    evidence: 'CPI print at 2.9% vs 3.1% expected. 10Y yield dropped instantly from 4.25% to 4.12%.',
  },
  {
    id: 'news-2',
    headline: 'NVIDIA Faces Potential New AI Chip Export Limits to Middle East',
    source: 'Reuters',
    date: '2026-07-11T09:15:00Z',
    assets: ['NVDA'],
    summary: 'The U.S. government is considering limiting exports of advanced AI chips from Nvidia and other chipmakers to certain Middle Eastern countries on national security grounds.',
    historicalComparison: 'Previous export restriction announcements (e.g., October 2023) led to a short-term drawdown of -6.5% for NVDA before recovery.',
    impact: 'Negativo',
    confidence: 75,
    explanation: 'Limits potential addressable market growth. While backlog demand in the US and Europe remains high, geo-political constraints introduce risk and uncertainty for hyperscaler demand.',
    evidence: 'Anonymous commerce department sources cited by major financial channels. No official policy signed yet.',
  },
  {
    id: 'news-3',
    headline: 'Bitcoin ETF Inflows Accelerate, Reaching $1.2B in Weekly Volume',
    source: 'Financial Times',
    date: '2026-07-10T18:00:00Z',
    assets: ['BTC', 'ETH'],
    summary: 'Spot Bitcoin exchange-traded funds registered their largest weekly inflows in three months, signalling institutional accumulation amid macro stabilization.',
    historicalComparison: 'Weeks with >$1B inflows have historically preceded a +4.5% price appreciation for BTC within 7 days in 82% of observed cases.',
    impact: 'Positivo',
    confidence: 90,
    explanation: 'Institutional buy pressure absorbs selling supply, reducing volatility and reinforcing the floor price of major digital assets.',
    evidence: 'SEC filing inflows data combined with verified ETF ledger tracking services.',
  },
  {
    id: 'news-4',
    headline: 'Tesla Deliveries Beat Q2 Estimates Amid European Expansion',
    source: 'Bloomberg',
    date: '2026-07-09T11:00:00Z',
    assets: ['TSLA'],
    summary: 'Tesla delivered 466k vehicles in the second quarter, beating consensus estimates of 448k. Production increased at Berlin and Shanghai gigafactories.',
    historicalComparison: 'Delivery beats typically spark a +3.2% rally on day 1, though pricing cuts impact gross margins long-term.',
    impact: 'Positivo',
    confidence: 82,
    explanation: 'Demonstrates resilient consumer demand and operational strength, offsetting concerns of market saturation in the EV sector.',
    evidence: 'Official press release and IR statements from Tesla Motors.',
  },
  {
    id: 'news-5',
    headline: 'Federal Reserve Signals Higher-for-Longer Stance on Policy Rates',
    source: 'Reuters',
    date: '2026-07-08T16:00:00Z',
    summary: 'Minutes from the recent FOMC meeting indicate officials remain concerned about structural service inflation and see no immediate rush to cut rates.',
    assets: ['US10Y', 'AAPL', 'NVDA'],
    historicalComparison: 'Hawkish FOMC minutes have historically caused a -1.8% correction in high-multiple growth equities within 48 hours.',
    impact: 'Negativo',
    confidence: 70,
    explanation: 'Persistent high interest rates raise the cost of capital, discounting the present value of future earnings for growth stocks and keeping bond yields high.',
    evidence: 'Official FOMC meeting minutes text released at 2:00 PM EST.',
  },
  {
    id: 'news-6',
    headline: 'Gold Prices Reach All-Time High on Geopolitical Uncertainty',
    source: 'Associated Press',
    date: '2026-07-10T22:30:00Z',
    assets: ['GLD'],
    summary: 'Gold spot prices surged past $2,450 per ounce as safe-haven demand intensified due to escalation of trade talks tensions between global economic blocs.',
    historicalComparison: 'Gold spot highs correlate with a drop in general risk appetite, pushing equity-to-gold ratios to 18-month lows.',
    impact: 'Positivo',
    confidence: 85,
    explanation: 'Safe-haven assets benefit from uncertainty and currency depreciation risks, attracting conservative retail and central bank capital.',
    evidence: 'Spot gold exchange data and COMEX pricing reports.',
  }
]

const INITIAL_BRIEFINGS = [
  {
    id: 'brief-1',
    watchlist: 'Tecnología y Crecimiento (Growth Tech)',
    targetAsset: 'NVDA',
    newsHeadline: 'NVIDIA Faces Potential New AI Chip Export Limits to Middle East',
    associatedMovement: 'Posible corrección de -5% a -8% en el corto plazo.',
    suggestedAction: 'Monitorear declaraciones oficiales de reguladores y proteger posiciones con opciones de venta o reducir exposición temporal.',
    status: 'Pendiente', // Pendiente, Revisada, Escalada, Descartada
    justification: '',
    alertCreated: false,
  },
  {
    id: 'brief-2',
    watchlist: 'Activos Digitales (Crypto)',
    targetAsset: 'BTC',
    newsHeadline: 'Bitcoin ETF Inflows Accelerate, Reaching $1.2B in Weekly Volume',
    associatedMovement: 'Tendencia alcista con proyección a probar resistencia anterior.',
    suggestedAction: 'Mantener asignación estratégica y colocar órdenes de compra escalonadas en soportes clave.',
    status: 'Revisada',
    justification: 'Los flujos institucionales validan el soporte en $60k. Recomendación validada para el reporte de inversión.',
    alertCreated: true,
  },
]

export default function App() {
  // State
  const [news, setNews] = useState(INITIAL_NEWS)
  const [briefings, setBriefings] = useState(INITIAL_BRIEFINGS)
  const [selectedNewsId, setSelectedNewsId] = useState(INITIAL_NEWS[0].id)
  
  // Filters State
  const [selectedInstrumentType, setSelectedInstrumentType] = useState('Todos')
  const [selectedAssetSymbol, setSelectedAssetSymbol] = useState('Todos')
  const [recencyFilter, setRecencyFilter] = useState('Todos')

  // Search state
  const [searchQuery, setSearchQuery] = useState('')

  const { fetchNewsForAssets, loading: newsLoading, error: newsError } = useMarketNews()

  useEffect(() => {
    async function loadRealNews() {
      const realNews = await fetchNewsForAssets(INITIAL_ASSETS, 7)
      if (realNews.length > 0) {
        setNews((prev) => [...realNews, ...prev])
      }
    }
    loadRealNews()
  }, [fetchNewsForAssets])

  // Selected news item details
  const selectedNews = useMemo(() => {
    return news.find((item) => item.id === selectedNewsId) || news[0]
  }, [news, selectedNewsId])

  // Computed properties
  const instrumentTypes = ['Todos', 'Acciones', 'Criptoactivos', 'Instrumentos de crédito', 'Otros']

  const filteredNews = useMemo(() => {
    return news.filter((item) => {
      // 1. Search Query
      if (searchQuery) {
        const matchesHeadline = item.headline.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesSummary = item.summary.toLowerCase().includes(searchQuery.toLowerCase())
        if (!matchesHeadline && !matchesSummary) return false
      }

      // 2. Instrument Type
      if (selectedInstrumentType !== 'Todos') {
        const hasAssetOfType = item.assets.some((symbol) => {
          const assetObj = INITIAL_ASSETS.find((a) => a.symbol === symbol)
          return assetObj && assetObj.type === selectedInstrumentType
        })
        if (!hasAssetOfType) return false
      }

      // 3. Asset Symbol
      if (selectedAssetSymbol !== 'Todos') {
        if (!item.assets.includes(selectedAssetSymbol)) return false
      }

      // 4. Recency
      if (recencyFilter !== 'Todos') {
        const newsDate = new Date(item.date)
        const now = new Date()
        const diffTime = Math.abs(now - newsDate)
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (recencyFilter === '24h' && diffDays > 1) return false
        if (recencyFilter === '7d' && diffDays > 7) return false
        if (recencyFilter === '30d' && diffDays > 30) return false
      }

      return true
    })
  }, [news, searchQuery, selectedInstrumentType, selectedAssetSymbol, recencyFilter])

  // Actions
  const handleStatusChange = (briefId, newStatus) => {
    setBriefings((prev) =>
      prev.map((b) => (b.id === briefId ? { ...b, status: newStatus } : b))
    )
  }

  const handleJustificationChange = (briefId, text) => {
    setBriefings((prev) =>
      prev.map((b) => (b.id === briefId ? { ...b, justification: text } : b))
    )
  }

  const toggleAlertCreated = (briefId) => {
    setBriefings((prev) =>
      prev.map((b) => (b.id === briefId ? { ...b, alertCreated: !b.alertCreated } : b))
    )
  }

  // Create Briefing from selected news
  const createBriefingFromSelected = () => {
    if (!selectedNews) return
    const assetSymbol = selectedNews.assets[0] || 'VAR'
    const newBrief = {
      id: `brief-${Date.now()}`,
      watchlist: `Análisis Especial (${assetSymbol})`,
      targetAsset: assetSymbol,
      newsHeadline: selectedNews.headline,
      associatedMovement: `Impacto ${selectedNews.impact} proyectado con confianza del ${selectedNews.confidence}%`,
      suggestedAction: `Investigar señal: ${selectedNews.explanation.substring(0, 100)}...`,
      status: 'Pendiente',
      justification: '',
      alertCreated: false,
    }
    setBriefings((prev) => [newBrief, ...prev])
  }

  // Quick form for simulating a new news entry (for rapid testing)
=======
function AppContent() {
  const { addNewsItem, selectNews } = useDashboard()
>>>>>>> origin/main
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
    watchlist: '',
    associatedMovement: '',
    suggestedAction: '',
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
      watchlist: newNewsForm.watchlist || '',
      associatedMovement: newNewsForm.associatedMovement || '',
      suggestedAction: newNewsForm.suggestedAction || '',
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
      watchlist: '',
      associatedMovement: '',
      suggestedAction: '',
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
<<<<<<< HEAD
        <section className="feed-section">
          <div className="section-header">
            <h2>Radar de Noticias y Activos</h2>
            <span className="count-badge">{filteredNews.length} Noticias</span>
            {newsLoading && <span className="count-badge">Cargando Currents...</span>}
            {newsError && <span className="count-badge bg-purple">Error: {newsError}</span>}
          </div>
=======
        <NewsSidebar />
>>>>>>> origin/main

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

              <div className="form-row">
                <div className="form-group">
                  <label>Watchlist Destino (Opcional)</label>
                  <input
                    type="text"
                    placeholder="ej. Renta Fija / Crédito"
                    value={newNewsForm.watchlist}
                    onChange={(e) => setNewNewsForm({ ...newNewsForm, watchlist: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Movimiento Estimado (Opcional)</label>
                  <input
                    type="text"
                    placeholder="ej. Corrección de -3% a -5%"
                    value={newNewsForm.associatedMovement}
                    onChange={(e) => setNewNewsForm({ ...newNewsForm, associatedMovement: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Acción de Investigación Sugerida (Opcional)</label>
                <input
                  type="text"
                  placeholder="ej. Comprar en retrocesos técnicos..."
                  value={newNewsForm.suggestedAction}
                  onChange={(e) => setNewNewsForm({ ...newNewsForm, suggestedAction: e.target.value })}
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
