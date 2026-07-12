// Firestore CRUD Service — Abstraction layer for all database operations
import { db } from './firebaseConfig'
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'

// ─── Collection References ───────────────────────────────────────────
const BRIEFINGS_COL = 'briefings'
const NEWS_CACHE_COL = 'news_cache'
const WATCHLISTS_COL = 'watchlists'

// ─── Briefings ───────────────────────────────────────────────────────

/**
 * Load all briefings from Firestore, ordered by createdAt descending.
 * @returns {Promise<Array>} Array of briefing objects
 */
export async function loadBriefings() {
  try {
    const q = query(collection(db, BRIEFINGS_COL), orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
  } catch (error) {
    console.error('Firestore: Failed to load briefings', error)
    return null // null signals caller to use fallback
  }
}

/**
 * Save a briefing to Firestore (create or overwrite).
 * @param {Object} briefing - Must include an `id` field.
 */
export async function saveBriefing(briefing) {
  try {
    const ref = doc(db, BRIEFINGS_COL, briefing.id)
    await setDoc(ref, {
      ...briefing,
      createdAt: briefing.createdAt || serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error('Firestore: Failed to save briefing', error)
  }
}

/**
 * Update a single field on a briefing document.
 * @param {string} id - Briefing document ID
 * @param {string} field - Field name to update
 * @param {*} value - New value
 */
export async function updateBriefingField(id, field, value) {
  try {
    const ref = doc(db, BRIEFINGS_COL, id)
    await updateDoc(ref, { [field]: value, updatedAt: serverTimestamp() })
  } catch (error) {
    console.error(`Firestore: Failed to update briefing ${id}.${field}`, error)
  }
}

// ─── News Analysis Cache ─────────────────────────────────────────────

/**
 * Retrieve a cached AI analysis by news headline.
 * Uses a sanitized headline as the document ID.
 * @param {string} headline
 * @returns {Promise<Object|null>} Cached analysis or null
 */
export async function getCachedAnalysis(headline) {
  try {
    const docId = sanitizeDocId(headline)
    const ref = doc(db, NEWS_CACHE_COL, docId)
    const snap = await getDoc(ref)
    return snap.exists() ? snap.data() : null
  } catch (error) {
    console.error('Firestore: Failed to get cached analysis', error)
    return null
  }
}

/**
 * Save an AI analysis result to the cache.
 * @param {string} headline - News headline (used as key)
 * @param {Object} analysis - The analysis result from Gemini/heuristic
 */
export async function saveCachedAnalysis(headline, analysis) {
  try {
    const docId = sanitizeDocId(headline)
    const ref = doc(db, NEWS_CACHE_COL, docId)
    await setDoc(ref, {
      headline,
      ...analysis,
      analyzedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error('Firestore: Failed to save cached analysis', error)
  }
}

// ─── Watchlists ──────────────────────────────────────────────────────

/**
 * Load all watchlists from Firestore.
 * @returns {Promise<Array|null>} Array of watchlist objects or null on error
 */
export async function loadWatchlists() {
  try {
    const snapshot = await getDocs(collection(db, WATCHLISTS_COL))
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
  } catch (error) {
    console.error('Firestore: Failed to load watchlists', error)
    return null
  }
}

/**
 * Save a watchlist to Firestore.
 * @param {Object} watchlist - Must include a `name` field.
 */
export async function saveWatchlist(watchlist) {
  try {
    const docId = sanitizeDocId(watchlist.name)
    const ref = doc(db, WATCHLISTS_COL, docId)
    await setDoc(ref, {
      ...watchlist,
      createdAt: watchlist.createdAt || serverTimestamp(),
    })
  } catch (error) {
    console.error('Firestore: Failed to save watchlist', error)
  }
}

/**
 * Delete a watchlist from Firestore by name.
 * @param {string} name - Watchlist name
 */
export async function deleteWatchlistDoc(name) {
  try {
    const docId = sanitizeDocId(name)
    const ref = doc(db, WATCHLISTS_COL, docId)
    await deleteDoc(ref)
  } catch (error) {
    console.error('Firestore: Failed to delete watchlist', error)
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────

/**
 * Sanitize a string to be a valid Firestore document ID.
 * Firestore IDs cannot contain `/` and must be < 1500 bytes.
 */
function sanitizeDocId(str) {
  return str
    .replace(/[/\\#$.\[\]]/g, '_')
    .substring(0, 200)
}
