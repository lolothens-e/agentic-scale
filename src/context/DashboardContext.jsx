import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { finnhubService } from '../services/finnhubService'
import { alphaService } from '../services/alphaService'
import { currentsService } from '../services/currentsService'
import { llmService } from '../services/llmService'
import { INITIAL_BRIEFINGS, INITIAL_NEWS } from '../services/mockData'
import {
  loadBriefings,
  saveBriefing,
  updateBriefingField,
  getCachedAnalysis,
  saveCachedAnalysis,
  loadWatchlists,
  saveWatchlist,
  deleteWatchlistDoc,
} from '../services/supabaseService'

const DashboardContext = createContext(null)

const LOCAL_STORAGE_KEY = 'scale_agents_briefings'
const NEWS_STORAGE_KEY = 'scale_agents_news_data'
const WATCHLISTS_STORAGE_KEY = 'scale_agents_watchlists'

const initialState = {
  news: [],
  briefings: [],
  selectedNewsId: null,
  watchlists: [],
  activeWatchlist: 'Todos',
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
            ? { 
                ...item, 
                ...action.payload.analysis,
                headline: action.payload.analysis.translatedHeadline || item.headline,
                summary: action.payload.analysis.translatedSummary || item.summary
              }
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
    case 'SET_ACTIVE_WATCHLIST':
      return {
        ...state,
        activeWatchlist: action.payload,
      }
    case 'SET_WATCHLISTS':
      return {
        ...state,
        watchlists: action.payload,
      }
    case 'ADD_WATCHLIST':
      return {
        ...state,
        watchlists: [...state.watchlists, action.payload],
      }
    case 'DELETE_WATCHLIST':
      return {
        ...state,
        watchlists: state.watchlists.filter((w) => w.name !== action.payload),
        activeWatchlist: state.activeWatchlist === action.payload ? 'Todos' : state.activeWatchlist,
      }
    default:
      return state
  }
}

export function DashboardProvider({ children }) {
  const [state, dispatch] = useReducer(dashboardReducer, initialState)

  // 1. Initial News Loading with Cache Support
  useEffect(() => {
    const loadInitialNews = async () => {
      dispatch({ type: 'SET_NEWS_LOADING', payload: true })
      
      // Load already cached news from LocalStorage (fast local cache for news bodies)
      let cachedNews = []
      try {
        const stored = localStorage.getItem(NEWS_STORAGE_KEY)
        if (stored) {
          cachedNews = JSON.parse(stored)
        }
      } catch (e) {
        console.error("Failed to load cached news", e)
      }

      // Fetch news from Finnhub, Alpha Vantage, and Currents in parallel
      const [finnhubNews, alphaNews, currentsNews] = await Promise.all([
        finnhubService.getLatestNews().catch(err => {
          console.error("Finnhub load failed:", err)
          return []
        }),
        alphaService.getLatestNews().catch(err => {
          console.error("Alpha Vantage load failed:", err)
          return []
        }),
        currentsService.getLatestNews().catch(err => {
          console.error("Currents load failed:", err)
          return []
        })
      ])

      // Merge API results
      let apiNews = [...(finnhubNews || []), ...(alphaNews || []), ...(currentsNews || [])]
      // Combine INITIAL_NEWS, cached news, and API news, deduplicating by headline.
      // 1. Start with INITIAL_NEWS so simulated news items are always present.
      const mergedMap = new Map()
      INITIAL_NEWS.forEach(item => mergedMap.set(item.headline, item))
      
      // 2. Overwrite or add cached news (maintaining prior analyses/briefings on those news).
      cachedNews.forEach(item => mergedMap.set(item.headline, item))
      
      // 3. Add newly fetched API news if not already present.
      apiNews.forEach(item => {
        if (!mergedMap.has(item.headline)) {
          mergedMap.set(item.headline, item)
        }
      })

      let merged = Array.from(mergedMap.values())

      // Sort chronologically descending
      merged.sort((a, b) => new Date(b.date) - new Date(a.date))

      // Pre-populate with cached analyses from localStorage (fast path)
      try {
        const cacheKey = 'scale_agents_news_cache'
        const currentCache = JSON.parse(localStorage.getItem(cacheKey) || '{}')
        merged = merged.map(item => {
          if (currentCache[item.headline]) {
            return { ...item, ...currentCache[item.headline] }
          }
          return item
        })
      } catch (e) {
        console.error("Failed to apply news analysis cache:", e)
      }

      dispatch({ type: 'SET_NEWS', payload: merged })
      
      // Save initial merged news list to local cache
      if (merged.length > 0) {
        localStorage.setItem(NEWS_STORAGE_KEY, JSON.stringify(merged))
      }

      dispatch({ type: 'SET_NEWS_LOADING', payload: false })
      
      if (merged.length > 0) {
        dispatch({ type: 'SELECT_NEWS_ID', payload: merged[0].id })
      }
    }
    loadInitialNews()
  }, [])

  // 2. Reactively Sync all state.news updates to LocalStorage
  useEffect(() => {
    if (state.news.length > 0) {
      localStorage.setItem(NEWS_STORAGE_KEY, JSON.stringify(state.news))
    }
  }, [state.news])

  // 3. Briefing Loading — Firestore first, localStorage fallback
  useEffect(() => {
    const initBriefings = async () => {
      const supabaseBriefings = await loadBriefings()

      if (supabaseBriefings && supabaseBriefings.length > 0) {
        dispatch({ type: 'SET_BRIEFINGS', payload: supabaseBriefings })
        // Also sync to localStorage as offline backup
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(supabaseBriefings))
      } else {
        // Fallback to localStorage
        const storedBriefs = localStorage.getItem(LOCAL_STORAGE_KEY)
        if (storedBriefs) {
          try {
            const parsed = JSON.parse(storedBriefs)
            dispatch({ type: 'SET_BRIEFINGS', payload: parsed })
            // Backfill Supabase with localStorage data
            parsed.forEach((b) => saveBriefing(b))
          } catch (e) {
            console.error("Failed to parse briefings from localStorage", e)
            dispatch({ type: 'SET_BRIEFINGS', payload: INITIAL_BRIEFINGS })
          }
        } else {
          dispatch({ type: 'SET_BRIEFINGS', payload: INITIAL_BRIEFINGS })
          // Seed Supabase with initial briefings
          INITIAL_BRIEFINGS.forEach((b) => saveBriefing(b))
        }
      }
    }
    initBriefings()
  }, [])

  // 4. Sync briefings to localStorage as offline backup (on every change)
  useEffect(() => {
    if (state.briefings.length > 0 || localStorage.getItem(LOCAL_STORAGE_KEY)) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state.briefings))
    }
  }, [state.briefings])

  // 5. Watchlist Loading — Firestore first, localStorage fallback
  useEffect(() => {
    const initWatchlists = async () => {
      const defaultWatchlists = [
        { name: 'Tecnología', assets: ['NVDA', 'TSLA', 'AAPL'] },
        { name: 'Cripto & Oro', assets: ['BTC', 'ETH', 'GLD'] }
      ]
      const supabaseWatchlists = await loadWatchlists()

      if (supabaseWatchlists && supabaseWatchlists.length > 0) {
        dispatch({ type: 'SET_WATCHLISTS', payload: supabaseWatchlists })
        localStorage.setItem(WATCHLISTS_STORAGE_KEY, JSON.stringify(supabaseWatchlists))
      } else {
        const storedWatchlists = localStorage.getItem(WATCHLISTS_STORAGE_KEY)
        if (storedWatchlists) {
          try {
            const parsed = JSON.parse(storedWatchlists)
            dispatch({ type: 'SET_WATCHLISTS', payload: parsed })
            parsed.forEach((w) => saveWatchlist(w))
          } catch (e) {
            console.error("Failed to parse watchlists from localStorage", e)
            dispatch({ type: 'SET_WATCHLISTS', payload: defaultWatchlists })
          }
        } else {
          dispatch({ type: 'SET_WATCHLISTS', payload: defaultWatchlists })
          defaultWatchlists.forEach((w) => saveWatchlist(w))
        }
      }
    }
    initWatchlists()
  }, [])

  // 6. Sync watchlists to localStorage as offline backup
  useEffect(() => {
    if (state.watchlists.length > 0 || localStorage.getItem(WATCHLISTS_STORAGE_KEY)) {
      localStorage.setItem(WATCHLISTS_STORAGE_KEY, JSON.stringify(state.watchlists))
    }
  }, [state.watchlists])

  // 7. React to selectedNewsId change to trigger LLM analysis if not present
  useEffect(() => {
    const selectedNewsItem = state.news.find((n) => n.id === state.selectedNewsId)
    if (selectedNewsItem && selectedNewsItem.impact === null) {
      const analyzeSelectedNews = async () => {
        // Check Firestore cache first, then localStorage cache
        const firestoreCached = await getCachedAnalysis(selectedNewsItem.headline)
        if (firestoreCached) {
          dispatch({
            type: 'UPDATE_ANALYSIS',
            payload: { id: selectedNewsItem.id, analysis: firestoreCached },
          })
          return
        }

        // Fallback: check localStorage cache
        const cacheKey = 'scale_agents_news_cache'
        try {
          const currentCache = JSON.parse(localStorage.getItem(cacheKey) || '{}')
          const cachedAnalysis = currentCache[selectedNewsItem.headline]
          if (cachedAnalysis) {
            dispatch({
              type: 'UPDATE_ANALYSIS',
              payload: { id: selectedNewsItem.id, analysis: cachedAnalysis },
            })
            // Backfill Supabase cache
            saveCachedAnalysis(selectedNewsItem, cachedAnalysis)
            return
          }
        } catch (e) {
          console.error("Failed to read from news cache:", e)
        }

        // No cache hit — call Gemini
        dispatch({ type: 'SET_ANALYSIS_LOADING', payload: true })
        try {
          const analysis = await llmService.analyzeNews(
            selectedNewsItem.headline,
            selectedNewsItem.summary,
            selectedNewsItem.assets
          )

          // Save to Supabase cache
          saveCachedAnalysis(selectedNewsItem, analysis)

          // Save to localStorage cache as offline backup
          try {
            const currentCache = JSON.parse(localStorage.getItem(cacheKey) || '{}')
            currentCache[selectedNewsItem.headline] = analysis
            localStorage.setItem(cacheKey, JSON.stringify(currentCache))
          } catch (e) {
            console.error("Failed to save to local storage cache:", e)
          }

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

  // ─── Context Actions ────────────────────────────────────────────────

  const selectNews = (id) => {
    dispatch({ type: 'SELECT_NEWS_ID', payload: id })
  }

  const addNewsItem = (newsObj) => {
    dispatch({ type: 'ADD_NEWS', payload: newsObj })
  }

  const updateBriefingStatus = (id, status) => {
    dispatch({ type: 'UPDATE_BRIEFING_STATUS', payload: { id, status } })
    // Sync to Supabase
    updateBriefingField(id, 'status', status)
  }

  const updateBriefingJustification = (id, justification) => {
    dispatch({ type: 'UPDATE_BRIEFING_JUSTIFICATION', payload: { id, justification } })
    // Sync to Supabase
    updateBriefingField(id, 'justification', justification)
  }

  const toggleAlert = (id) => {
    dispatch({ type: 'TOGGLE_ALERT', payload: { id } })
    // Find the current state and sync the toggled value
    const briefing = state.briefings.find((b) => b.id === id)
    if (briefing) {
      updateBriefingField(id, 'alertCreated', !briefing.alertCreated)
    }
  }

  const createBriefing = (newsId) => {
    const item = state.news.find((n) => n.id === newsId)
    if (!item) return
    
    // Prevent duplicates
    if (state.briefings.find(b => b.newsHeadline === item.headline)) {
      return
    }

    const assetSymbol = item.assets[0] || 'GEN'
    const newBrief = {
      id: crypto.randomUUID(),
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
    // Persist to Supabase
    saveBriefing(newBrief, item)
  }

  const setFilters = (newFilters) => {
    dispatch({ type: 'SET_FILTERS', payload: newFilters })
  }

  // Create briefings for all news items matching the active watchlist's assets
  const createWatchlistBriefing = () => {
    const activeList = state.watchlists.find((w) => w.name === state.activeWatchlist)
    if (!activeList) return
    const watchlistAssets = activeList.assets.map((a) => a.toUpperCase())
    const existingHeadlines = new Set(state.briefings.map((b) => b.newsHeadline))
    const matchingNews = state.news.filter((item) =>
      item.assets && item.assets.some((a) => watchlistAssets.includes(a.toUpperCase()))
    )
    matchingNews.forEach((item) => {
      // Skip if this article already has a briefing
      if (existingHeadlines.has(item.headline)) return
      const assetSymbol = item.assets[0] || 'GEN'
      const newBrief = {
        id: crypto.randomUUID(),
        watchlist: `Lista: ${state.activeWatchlist}`,
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
      existingHeadlines.add(item.headline)
      dispatch({ type: 'ADD_BRIEFING', payload: newBrief })
      // Persist to Supabase
      saveBriefing(newBrief, item)
    })
  }

  const setActiveWatchlist = (name) => {
    dispatch({ type: 'SET_ACTIVE_WATCHLIST', payload: name })
  }

  const addWatchlist = (watchlistObj) => {
    dispatch({ type: 'ADD_WATCHLIST', payload: watchlistObj })
    // Persist to Supabase
    saveWatchlist(watchlistObj)
  }

  const deleteWatchlist = (name) => {
    dispatch({ type: 'DELETE_WATCHLIST', payload: name })
    // Delete from Supabase
    deleteWatchlistDoc(name)
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
        createWatchlistBriefing,
        setFilters,
        setActiveWatchlist,
        addWatchlist,
        deleteWatchlist,
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
