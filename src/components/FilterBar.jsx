import React from 'react'
import { useDashboard } from '../context/DashboardContext'
import { INITIAL_ASSETS, getAssetType, getAssetName } from '../services/mockData'

export default function FilterBar() {
  const { news, filters, setFilters } = useDashboard()
  const instrumentTypes = ['Todos', 'Acciones', 'Criptoactivos', 'Instrumentos de crédito', 'Otros']

  const availableAssets = React.useMemo(() => {
    const newsTickers = new Set()
    news.forEach(item => {
      if (item.assets) {
        item.assets.forEach(symbol => {
          if (symbol) newsTickers.add(symbol.toUpperCase().trim())
        })
      }
    })

    const list = []
    
    // Start with all INITIAL_ASSETS
    INITIAL_ASSETS.forEach(asset => {
      list.push({
        symbol: asset.symbol,
        name: asset.name,
        type: asset.type
      })
      newsTickers.delete(asset.symbol)
    })

    // Add any remaining news tickers
    newsTickers.forEach(symbol => {
      list.push({
        symbol: symbol,
        name: getAssetName(symbol),
        type: getAssetType(symbol)
      })
    })

    return list
  }, [news])

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
            {availableAssets.filter(
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
          <div className="radio-pill-group">
            {[
              { label: 'Todos', value: 'Todos' },
              { label: '24h', value: '24h' },
              { label: '7d', value: '7d' },
              { label: '30d', value: '30d' }
            ].map((option) => (
              <label 
                key={option.value} 
                className={`radio-pill-label ${filters.recency === option.value ? 'active' : ''}`}
              >
                <input
                  type="radio"
                  name="recency"
                  value={option.value}
                  checked={filters.recency === option.value}
                  onChange={handleRecencyChange}
                  className="radio-pill-input"
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
