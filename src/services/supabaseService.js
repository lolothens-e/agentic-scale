import { supabase } from './supabaseClient'

// ─── HELPER: Ensure News and Assets exist ──────────────────────────────
async function ensureNewsExists(newsItem) {
  // 1. Ensure assets exist
  for (const symbol of newsItem.assets || []) {
    await supabase.from('assets').upsert({
      symbol: symbol.toUpperCase(),
      name: symbol.toUpperCase(),
      type: 'Otros'
    }, { onConflict: 'symbol' })
  }

  // 2. Insert or get news item
  // We use the headline as external_id since the original mock/API didn't always have stable IDs
  const externalId = newsItem.id || newsItem.headline
  const { data: newsData, error: newsError } = await supabase
    .from('news')
    .upsert({
      external_id: externalId.substring(0, 150),
      source: newsItem.source || 'Unknown',
      headline: newsItem.headline.substring(0, 500),
      summary: newsItem.summary,
      published_at: new Date(newsItem.date || Date.now()).toISOString(),
    }, { onConflict: 'external_id, source', ignoreDuplicates: false })
    .select('id')
    .single()

  if (newsError) {
    console.error('Error inserting news:', newsError)
    // Fallback: Try to fetch it if upsert failed (e.g., duplicate without returning)
    const { data: existingNews } = await supabase
      .from('news')
      .select('id')
      .eq('external_id', externalId.substring(0, 150))
      .single()
    
    if (existingNews) return existingNews.id
    return null
  }

  const newsId = newsData?.id
  
  // 3. Link news_assets
  if (newsId && newsItem.assets) {
    for (const symbol of newsItem.assets) {
      await supabase.from('news_assets').upsert({
        news_id: newsId,
        asset_symbol: symbol.toUpperCase()
      }, { onConflict: 'news_id, asset_symbol' })
    }
  }

  return newsId
}

// ─── Briefings ───────────────────────────────────────────────────────

export async function loadBriefings() {
  try {
    const { data, error } = await supabase
      .from('briefings')
      .select(`
        id, target_asset, associated_movement, suggested_action, status, justification, alert_created, created_at, watchlist_label,
        news ( headline )
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Map back to UI structure
    return data.map(b => ({
      id: b.id,
      targetAsset: b.target_asset,
      associatedMovement: b.associated_movement,
      suggestedAction: b.suggested_action,
      status: b.status,
      justification: b.justification,
      alertCreated: b.alert_created,
      newsHeadline: b.news?.headline,
      watchlist: b.watchlist_label
    }))
  } catch (error) {
    console.error('Supabase: Failed to load briefings', error)
    return null
  }
}

export async function saveBriefing(briefing, newsItemContext) {
  try {
    // 1. Get/Create the news record first to satisfy foreign key
    let newsId = null;
    if (newsItemContext) {
      newsId = await ensureNewsExists(newsItemContext)
    }

    if (!newsId) {
       console.warn("Supabase: Cannot save briefing without a valid news record.")
       return
    }

    // Ensure asset exists
    await supabase.from('assets').upsert({
      symbol: briefing.targetAsset.toUpperCase(),
      name: briefing.targetAsset.toUpperCase(),
      type: 'Otros'
    }, { onConflict: 'symbol' })

    // Insert briefing
    // We ignore briefing.id because Supabase generates a UUID
    const { error } = await supabase
      .from('briefings')
      .insert({
        news_id: newsId,
        target_asset: briefing.targetAsset,
        watchlist_label: briefing.watchlist,
        associated_movement: briefing.associatedMovement,
        suggested_action: briefing.suggestedAction,
        status: briefing.status || 'Pendiente',
        justification: briefing.justification || '',
        alert_created: briefing.alertCreated || false
      })

    if (error) throw error
  } catch (error) {
    console.error('Supabase: Failed to save briefing', error)
  }
}

export async function updateBriefingField(id, field, value) {
  try {
    // Mapping frontend fields to DB columns
    const fieldMap = {
      status: 'status',
      justification: 'justification',
      alertCreated: 'alert_created'
    }
    
    const dbColumn = fieldMap[field]
    if (!dbColumn) return

    // Ensure status matches enum exactly (e.g., 'Pendiente', 'Revisada', etc.)
    const { error } = await supabase
      .from('briefings')
      .update({ [dbColumn]: value, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) throw error
  } catch (error) {
    console.error(`Supabase: Failed to update briefing ${id}.${field}`, error)
  }
}

// ─── News Analysis Cache ─────────────────────────────────────────────

export async function getCachedAnalysis(headline) {
  try {
    const { data: newsData } = await supabase
      .from('news')
      .select('id')
      .eq('headline', headline.substring(0, 500))
      .single()

    if (!newsData) return null

    const { data: analysis, error } = await supabase
      .from('news_analysis')
      .select('*')
      .eq('news_id', newsData.id)
      .single()

    if (error || !analysis) return null

    // Map to frontend expected format
    return {
      impact: analysis.impact,
      confidence: analysis.confidence,
      explanation: analysis.explanation,
      evidence: analysis.evidence,
      historicalComparison: analysis.historical_comparison,
      associatedMovement: analysis.associated_movement,
      suggestedAction: analysis.suggested_action
    }
  } catch (error) {
    console.error('Supabase: Failed to get cached analysis', error)
    return null
  }
}

export async function saveCachedAnalysis(newsItemContext, analysis) {
  try {
    const newsId = await ensureNewsExists(newsItemContext)
    if (!newsId) return

    const { error } = await supabase
      .from('news_analysis')
      .upsert({
        news_id: newsId,
        impact: analysis.impact,
        confidence: parseInt(analysis.confidence) || 50,
        explanation: analysis.explanation,
        evidence: analysis.evidence,
        historical_comparison: analysis.historicalComparison,
        associated_movement: analysis.associatedMovement,
        suggested_action: analysis.suggestedAction
      }, { onConflict: 'news_id' })

    if (error) throw error
  } catch (error) {
    console.error('Supabase: Failed to save cached analysis', error)
  }
}

// ─── Watchlists ──────────────────────────────────────────────────────

export async function loadWatchlists() {
  try {
    const { data, error } = await supabase
      .from('watchlists')
      .select(`
        name,
        watchlist_assets ( asset_symbol )
      `)

    if (error) throw error

    return data.map(w => ({
      name: w.name,
      assets: w.watchlist_assets.map(a => a.asset_symbol)
    }))
  } catch (error) {
    console.error('Supabase: Failed to load watchlists', error)
    return null
  }
}

export async function saveWatchlist(watchlist) {
  try {
    // 1. Insert Watchlist
    const { data: wlData, error: wlError } = await supabase
      .from('watchlists')
      .upsert({ name: watchlist.name }, { onConflict: 'name' })
      .select('id')
      .single()

    if (wlError) throw wlError
    const watchlistId = wlData.id

    // 2. Ensure assets exist and link them
    for (const symbol of watchlist.assets) {
      const sym = symbol.toUpperCase()
      await supabase.from('assets').upsert({
        symbol: sym,
        name: sym,
        type: 'Otros'
      }, { onConflict: 'symbol' })

      await supabase.from('watchlist_assets').upsert({
        watchlist_id: watchlistId,
        asset_symbol: sym
      }, { onConflict: 'watchlist_id, asset_symbol' })
    }
  } catch (error) {
    console.error('Supabase: Failed to save watchlist', error)
  }
}

export async function deleteWatchlistDoc(name) {
  try {
    const { error } = await supabase
      .from('watchlists')
      .delete()
      .eq('name', name)

    if (error) throw error
  } catch (error) {
    console.error('Supabase: Failed to delete watchlist', error)
  }
}
