import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { finnhubService } from '../services/finnhubService'
import { llmService } from '../services/llmService'
import { INITIAL_BRIEFINGS } from '../services/mockData'

const DashboardContext = createContext(null)

const LOCAL_STORAGE_KEY = 'scale_agents_briefings'

const initialState = {
  news: [],
  briefings: [],
  selectedNewsId: null,
  filters: {
    instrumentType: 'Todos',
    assetSymbol: 'Todos',
    recency: 'Todos',
    searchQuery: '',
  },
  isLoadingNews: false,
  isLoadingAnalysis: false,
  analysisError: null,
}

function dashboardReducer(state, action) {
  switch (action.type) {
    case 'SET_NEWS_LOADING':
      return { ...state, isLoadingNews: action.payload }
    case 'SET_NEWS':
      return { ...state, news: action.payload }
    case 'ADD_NEWS':
      return { 
        ...state, 
        news: [action.payload, ...state.news] 
      }
    case 'SELECT_NEWS_ID':
      return { ...state, selectedNewsId: action.payload, analysisError: null }
    case 'SET_ANALYSIS_LOADING':
      return { ...state, isLoadingAnalysis: action.payload }
    case 'UPDATE_ANALYSIS':
      return {
        ...state,
        news: state.news.map((item) =>
          item.id === action.payload.id
            ? { ...item, ...action.payload.analysis }
            : item
        ),
      }
    case 'SET_ANALYSIS_ERROR':
      return { ...state, analysisError: action.payload }
    case 'SET_BRIEFINGS':
      return { ...state, briefings: action.payload }
    case 'ADD_BRIEFING':
      return { 
        ...state, 
        briefings: [action.payload, ...state.briefings] 
      }
    case 'UPDATE_BRIEFING_STATUS':
      return {
        ...state,
        briefings: state.briefings.map((b) =>
          b.id === action.payload.id ? { ...b, status: action.payload.status } : b
        ),
      }
    case 'UPDATE_BRIEFING_JUSTIFICATION':
      return {
        ...state,
        briefings: state.briefings.map((b) =>
          b.id === action.payload.id ? { ...b, justification: action.payload.justification } : b
        ),
      }
    case 'TOGGLE_ALERT':
      return {
        ...state,
        briefings: state.briefings.map((b) =>
          b.id === action.payload.id ? { ...b, alertCreated: !b.alertCreated } : b
        ),
      }
    case 'SET_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      }
    default:
      return state
  }
}

export function DashboardProvider({ children }) {
  const [state, dispatch] = useReducer(dashboardReducer, initialState)

  // 1. Initial News Loading
  useEffect(() => {
    const loadInitialNews = async () => {
      dispatch({ type: 'SET_NEWS_LOADING', payload: true })
      const data = await finnhubService.getLatestNews()
      dispatch({ type: 'SET_NEWS', payload: data })
      dispatch({ type: 'SET_NEWS_LOADING', payload: false })
      if (data.length > 0) {
        dispatch({ type: 'SELECT_NEWS_ID', payload: data[0].id })
      }
    }
    loadInitialNews()
  }, [])

  // 2. LocalStorage Briefing Sync
  useEffect(() => {
    const storedBriefs = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (storedBriefs) {
      try {
        dispatch({ type: 'SET_BRIEFINGS', payload: JSON.parse(storedBriefs) })
      } catch (e) {
        console.error("Failed to parse briefings from localStorage", e)
        dispatch({ type: 'SET_BRIEFINGS', payload: INITIAL_BRIEFINGS })
      }
    } else {
      dispatch({ type: 'SET_BRIEFINGS', payload: INITIAL_BRIEFINGS })
    }
  }, [])

  useEffect(() => {
    if (state.briefings.length > 0 || localStorage.getItem(LOCAL_STORAGE_KEY)) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state.briefings))
    }
  }, [state.briefings])

  // 3. React to selectedNewsId change to trigger LLM analysis if not present
  useEffect(() => {
    const selectedNewsItem = state.news.find((n) => n.id === state.selectedNewsId)
    if (selectedNewsItem && selectedNewsItem.impact === null) {
      const analyzeSelectedNews = async () => {
        dispatch({ type: 'SET_ANALYSIS_LOADING', payload: true })
        try {
          const analysis = await llmService.analyzeNews(
            selectedNewsItem.headline,
            selectedNewsItem.summary,
            selectedNewsItem.assets
          )
          dispatch({
            type: 'UPDATE_ANALYSIS',
            payload: { id: selectedNewsItem.id, analysis },
          })
        } catch (error) {
          console.error("AI Analysis failed:", error)
          dispatch({ type: 'SET_ANALYSIS_ERROR', payload: error.message })
        } finally {
          dispatch({ type: 'SET_ANALYSIS_LOADING', payload: false })
        }
      }
      analyzeSelectedNews()
    }
  }, [state.selectedNewsId, state.news])

  // Context Actions
  const selectNews = (id) => {
    dispatch({ type: 'SELECT_NEWS_ID', payload: id })
  }

  const addNewsItem = (newsObj) => {
    dispatch({ type: 'ADD_NEWS', payload: newsObj })
  }

  const updateBriefingStatus = (id, status) => {
    dispatch({ type: 'UPDATE_BRIEFING_STATUS', payload: { id, status } })
  }

  const updateBriefingJustification = (id, justification) => {
    dispatch({ type: 'UPDATE_BRIEFING_JUSTIFICATION', payload: { id, justification } })
  }

  const toggleAlert = (id) => {
    dispatch({ type: 'TOGGLE_ALERT', payload: { id } })
  }

  const createBriefing = (newsId) => {
    const item = state.news.find((n) => n.id === newsId)
    if (!item) return

    const assetSymbol = item.assets[0] || 'GEN'
    const newBrief = {
      id: `brief-${Date.now()}`,
      watchlist: item.watchlist || `Análisis Especial (${assetSymbol})`,
      targetAsset: assetSymbol,
      newsHeadline: item.headline,
      associatedMovement: item.associatedMovement || (item.impact 
        ? `Impacto ${item.impact} proyectado con confianza del ${item.confidence}%` 
        : 'Analizando impacto...'),
      suggestedAction: item.suggestedAction || (item.explanation 
        ? `Investigar señal: ${item.explanation.substring(0, 100)}...` 
        : 'Investigar señal de impacto.'),
      status: 'Pendiente',
      justification: '',
      alertCreated: false,
    }
    dispatch({ type: 'ADD_BRIEFING', payload: newBrief })
  }

  const setFilters = (newFilters) => {
    dispatch({ type: 'SET_FILTERS', payload: newFilters })
  }

  return (
    <DashboardContext.Provider
      value={{
        ...state,
        selectNews,
        addNewsItem,
        updateBriefingStatus,
        updateBriefingJustification,
        toggleAlert,
        createBriefing,
        setFilters,
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const context = useContext(DashboardContext)
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider')
  }
  return context
}
