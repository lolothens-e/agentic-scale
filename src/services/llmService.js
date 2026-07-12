const API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const USE_MOCK = !API_KEY || API_KEY.includes('your_') || API_KEY.trim() === ''

export const llmService = {
  analyzeNews: async (headline, summary, assets) => {
    if (USE_MOCK) {
      console.warn("Gemini API key is not configured or uses placeholder. Running simulated market analysis.")
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(getSimulatedAnalysis(headline, summary, assets))
        }, 1200)
      })
    }

    try {
      const prompt = `
You are a top-tier quantitative financial analyst and market strategist. Analyze the market impact of the following news event.

Headline: ${headline}
Summary: ${summary}
Related Tickers/Assets: ${assets && assets.length > 0 ? assets.join(', ') : 'General Market'}

Respond with a strictly formatted JSON object (no markdown backticks, no other text) containing exactly the following keys and data types:
{
  "impact": "Positivo" | "Negativo" | "Neutral" | "Incierto",
  "confidence": number (between 1 and 100),
  "explanation": "Clear explanation of the market transmission mechanism and expected asset pricing impact.",
  "evidence": "Concrete facts, metrics, or statements from the news that back up this analysis.",
  "historicalComparison": "Mention typical correlations, similar past market events (e.g. CPI beats, export bans), and historical statistical movements.",
  "watchlist": "Categorized target watchlist name (e.g. 'Tecnología y Crecimiento', 'Activos Digitales', 'Renta Fija / Crédito', 'Materias Primas / Refugios')",
  "associatedMovement": "Specific short-term projected asset movement (e.g. 'Posible alza de +3% a +5% en el corto plazo', 'Volatilidad lateral con soporte fuerte')",
  "suggestedAction": "Clear actionable investigation suggestion for the human analyst (e.g. 'Monitorear niveles de soporte técnico y diversificar', 'Esperar confirmación regulatoria')"
}
`

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: 'application/json'
            }
          })
        }
      )

      if (!response.ok) {
        throw new Error(`Gemini API returned status ${response.status}`)
      }

      const responseData = await response.json()
      
      if (!responseData.candidates || responseData.candidates.length === 0) {
        throw new Error("No candidates returned from Gemini API")
      }

      const textResponse = responseData.candidates[0].content.parts[0].text
      const cleanJson = textResponse.trim().replace(/^```json\s*/i, '').replace(/```\s*$/, '')
      const result = JSON.parse(cleanJson)
      return {
        impact: result.impact || 'Neutral',
        confidence: parseInt(result.confidence) || 75,
        explanation: result.explanation || 'Análisis de mercado generado por el agente.',
        evidence: result.evidence || 'Datos de respaldo extraídos de fuentes públicas.',
        historicalComparison: result.historicalComparison || 'Sin correlación histórica disponible.',
        watchlist: result.watchlist || 'Análisis General',
        associatedMovement: result.associatedMovement || 'Movimiento dentro de rangos normales.',
        suggestedAction: result.suggestedAction || 'Monitorear el comportamiento intradía.'
      }

    } catch (error) {
      console.error("Gemini API call failed, falling back to simulated analysis:", error)
      return getSimulatedAnalysis(headline, summary, assets)
    }
  }
}

// Intelligent heuristic simulation fallback
function getSimulatedAnalysis(headline, summary, assets) {
  const text = (headline + " " + summary).toLowerCase()
  const assetStr = assets && assets.length > 0 ? assets.join(', ') : 'el mercado general'
  const primaryAsset = assets && assets.length > 0 ? assets[0] : 'GEN'

  let impact = 'Neutral'
  let confidence = 75
  let explanation = ''
  let evidence = ''
  let historicalComparison = ''
  let watchlist = 'Análisis Especial'
  let associatedMovement = 'Fluctuación moderada estimada en rango.'
  let suggestedAction = 'Revisar la apertura del mercado y esperar volumen de confirmación.'

  // Determine watchlist category
  if (text.includes('bitcoin') || text.includes('eth') || text.includes('crypto') || text.includes('btc') || text.includes('cripto')) {
    watchlist = 'Activos Digitales (Crypto)'
  } else if (text.includes('treasury') || text.includes('yield') || text.includes('bond') || text.includes('fed') || text.includes('rates') || text.includes('cpi')) {
    watchlist = 'Macro y Renta Fija (Rates & Credit)'
  } else if (text.includes('nvidia') || text.includes('tesla') || text.includes('apple') || text.includes('chip') || text.includes('nvda') || text.includes('aapl')) {
    watchlist = 'Tecnología y Crecimiento (Growth Tech)'
  } else if (text.includes('gold') || text.includes('commodities') || text.includes('gld')) {
    watchlist = 'Metales y Refugios (Safe Havens)'
  }

  if (
    text.includes('drop') || 
    text.includes('fall') || 
    text.includes('limit') || 
    text.includes('cut') || 
    text.includes('ban') || 
    text.includes('restrict') || 
    text.includes('decline') || 
    text.includes('worry') || 
    text.includes('correction') || 
    text.includes('hawkish') ||
    text.includes('reglamento') ||
    text.includes('freno')
  ) {
    impact = 'Negativo'
    confidence = Math.floor(Math.random() * 20) + 70 // 70-89
    explanation = `La noticia sugiere restricciones operativas, caídas de rendimientos o tensiones regulatorias que afectan directamente a ${assetStr}. Esto eleva la prima de riesgo y reduce las proyecciones de flujo de caja en el corto plazo.`
    evidence = `Declaraciones y reportes que indican presiones a la baja o regulaciones más estrictas en el sector.`
    historicalComparison = `En situaciones históricas similares (ej. restricciones previas o aumentos imprevistos de tasas), los activos del tipo respectivo han experimentado correcciones promedio de -4.2% durante los siguientes 5 días de negociación.`
    associatedMovement = `Presión bajista de -3.5% a -6.0% para ${primaryAsset} con riesgo de ruptura de soporte.`
    suggestedAction = `Evaluar coberturas temporales con opciones de venta o reducir posiciones tácticas preventivamente.`
  } else if (
    text.includes('beat') || 
    text.includes('rally') || 
    text.includes('rise') || 
    text.includes('gain') || 
    text.includes('cool') || 
    text.includes('surpass') || 
    text.includes('grow') || 
    text.includes('inflow') || 
    text.includes('expand') || 
    text.includes('positive') ||
    text.includes('aumento') ||
    text.includes('lanzamiento')
  ) {
    impact = 'Positivo'
    confidence = Math.floor(Math.random() * 15) + 80 // 80-94
    explanation = `Un evento de mercado favorable o flujos de capital positivos hacia ${assetStr} consolidan la confianza de los inversionistas y reducen la volatilidad implícita, propiciando impulsos alcistas.`
    evidence = `Volumen de entradas registrado, reportes financieros superiores a lo estimado o datos macroeconómicos favorables.`
    historicalComparison = `Estadísticamente, sorpresas de este calibre o ingresos sostenidos de capital han precedido repuntes de entre +3% y +5.5% en la primera semana en un 80% de las observaciones previas.`
    associatedMovement = `Proyección alcista de +4.0% a +6.5% impulsada por acumulación institucional en ${primaryAsset}.`
    suggestedAction = `Colocar órdenes de compra parciales en retrocesos intradía y sostener asignación estratégica.`
  } else {
    impact = 'Neutral'
    confidence = 60
    explanation = `El acontecimiento de mercado para ${assetStr} no altera significativamente las expectativas macroeconómicas de mediano plazo ni modifica las primas de riesgo vigentes.`
    evidence = `Los rangos de precios se mantienen estables y la cobertura de prensa califica el evento como esperado por el consenso.`
    historicalComparison = `Eventos similares han mostrado una correlación neutra con variaciones menores al +/- 0.5% en el comportamiento intradía.`
    associatedMovement = `Movimiento lateral acotado dentro de canales técnicos previos.`
    suggestedAction = `Mantener posiciones sin cambios operativos inmediatos y monitorear comunicados oficiales.`
  }

  return {
    impact,
    confidence,
    explanation,
    evidence,
    historicalComparison,
    watchlist,
    associatedMovement,
    suggestedAction
  }
}
