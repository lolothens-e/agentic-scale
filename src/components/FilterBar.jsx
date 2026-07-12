import React from 'react'
import { useDashboard } from '../context/DashboardContext'
import { INITIAL_ASSETS } from '../services/mockData'

export default function FilterBar() {
  const { filters, setFilters } = useDashboard()
  const instrumentTypes = ['Todos', 'Acciones', 'Criptoactivos', 'Instrumentos de crédito', 'Otros']

  const handleSearchChange = (e) => {
    setFilters({ searchQuery: e.target.value })
  }

  const handleInstrumentChange = (e) => {
    setFilters({ 
      instrumentType: e.target.value,
      assetSymbol: 'Todos' // reset asset filter when type changes
    })
  }

  const handleAssetChange = (e) => {
    setFilters({ assetSymbol: e.target.value })
  }

  const handleRecencyChange = (e) => {
    setFilters({ recency: e.target.value })
  }

  const clearSearch = () => {
    setFilters({ searchQuery: '' })
  }

  return (
    <div className="filter-card">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar noticia por palabra clave..."
          value={filters.searchQuery}
          onChange={handleSearchChange}
        />
        {filters.searchQuery && (
          <button className="clear-search" onClick={clearSearch}>×</button>
        )}
      </div>

      <div className="filter-dropdowns">
        <div className="filter-group">
          <label>Tipo de Instrumento</label>
          <select value={filters.instrumentType} onChange={handleInstrumentChange}>
            {instrumentTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Activo Específico</label>
          <select value={filters.assetSymbol} onChange={handleAssetChange}>
            <option value="Todos">Todos los activos</option>
            {INITIAL_ASSETS.filter(
              (a) => filters.instrumentType === 'Todos' || a.type === filters.instrumentType
            ).map((asset) => (
              <option key={asset.symbol} value={asset.symbol}>
                {asset.symbol} - {asset.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Antigüedad</label>
          <select value={filters.recency} onChange={handleRecencyChange}>
            <option value="Todos">Cualquier fecha</option>
            <option value="24h">Últimas 24 horas</option>
            <option value="7d">Últimos 7 días</option>
            <option value="30d">Últimos 30 días</option>
          </select>
        </div>
      </div>
    </div>
  )
}
