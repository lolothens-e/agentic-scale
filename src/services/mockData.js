export const INITIAL_ASSETS = [
  { symbol: 'NVDA', name: 'NVIDIA Corp.', type: 'Acciones' },
  { symbol: 'TSLA', name: 'Tesla Inc.', type: 'Acciones' },
  { symbol: 'AAPL', name: 'Apple Inc.', type: 'Acciones' },
  { symbol: 'BTC', name: 'Bitcoin', type: 'Criptoactivos' },
  { symbol: 'ETH', name: 'Ethereum', type: 'Criptoactivos' },
  { symbol: 'US10Y', name: 'US 10-Year Treasury', type: 'Instrumentos de crédito' },
  { symbol: 'LQD', name: 'iShares Corporate Bond ETF', type: 'Instrumentos de crédito' },
  { symbol: 'GLD', name: 'SPDR Gold Shares', type: 'Otros' },
]

export const INITIAL_NEWS = [
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
    assets: ['US10Y', 'AAPL', 'NVDA'],
    summary: 'Minutes from the recent FOMC meeting indicate officials remain concerned about structural service inflation and see no immediate rush to cut rates.',
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
  },
  {
    id: 'news-7',
    headline: 'Tesla Shares Fluctuate After Q2 Production Adjustments in Berlin Factory',
    source: 'Bloomberg',
    date: '2026-06-30T10:00:00Z', // ~12 days ago, tests 30d filter
    assets: ['TSLA'],
    summary: 'Tesla modified its production schedules in Europe to integrate new battery pack assembly lines, causing temporary delivery adjustments for Berlin-made Model Ys.',
    historicalComparison: 'Production pauses for upgrades historically create short-term delivery drop worries, resulting in -3% corrections followed by strong rallies.',
    impact: 'Neutral',
    confidence: 70,
    explanation: 'Temporary operational shutdowns are priced in by analysts but trigger automated retail selling. Long-term capacity increases offset short-term delays.',
    evidence: 'Berlin factory newsletter and regional supplier delivery logs.',
  },
  {
    id: 'news-8',
    headline: 'Ethereum Layer-2 Network Activity Surges to Record Transactions',
    source: 'Reuters',
    date: '2026-06-01T15:00:00Z', // ~40 days ago, tests Todos (older than 30d) filter
    assets: ['ETH'],
    summary: 'Aggregated transaction volumes across major Ethereum rollup networks reached an all-time high of 140 transactions per second, reducing average gas fees.',
    historicalComparison: 'Layer-2 activity spikes precede ether accumulation by gas-paying decentralized application routers by 10 to 15 days.',
    impact: 'Positivo',
    confidence: 85,
    explanation: 'Surging usage shows high organic demand for the ecosystem. Lower fees attract retail user volumes, reinforcing native network token utility.',
    evidence: 'On-chain explorer metrics and layer-2 gas usage tracker dashboards.',
  },
  {
    id: 'news-9',
    headline: 'US Corporate Bond Issuance Slows Down Following Yield Hikes',
    source: 'Financial Times',
    date: '2026-06-25T11:00:00Z', // ~17 days ago, tests 30d filter (credit type)
    assets: ['LQD'],
    summary: 'High-grade corporate borrowers delayed major bond sales as corporate yield spreads expanded, waiting for a more stable macroeconomic environment.',
    historicalComparison: 'Bond issuance slowdowns correlate with brief increases in index bond ETF values due to reduced new debt supply in secondary markets.',
    impact: 'Negativo',
    confidence: 78,
    explanation: 'Higher yields increase corporate borrowing costs, signaling potential margin squeeze for heavy debt issuers but stabilizing cash-rich corporate values.',
    evidence: 'SEC debt registration filings compiled by major fixed-income trading platforms.',
  },
  {
    id: 'news-10',
    headline: 'Central Banks Accelerate Gold Purchases for Reserve Diversification',
    source: 'Financial Times',
    date: '2026-05-15T09:00:00Z', // ~57 days ago, tests Todos (older than 30d) filter (Otros type)
    assets: ['GLD'],
    summary: 'Global monetary authorities increased gold bar accumulations by 15% year-on-year, citing inflation hedging and geopolitical asset protection strategy.',
    historicalComparison: 'Central bank net buying has historically supported a solid price floor for gold futures, leading to 12-month gains of over +8.5%.',
    impact: 'Positivo',
    confidence: 92,
    explanation: 'Sustained institutional buying takes physical supply off the market, reinforcing gold as the ultimate store of value during times of currency volatility.',
    evidence: 'World Gold Council quarterly reserves report and IMF purchase registries.',
  }
]

export const INITIAL_BRIEFINGS = [
  {
    id: 'brief-1',
    watchlist: 'Tecnología y Crecimiento (Growth Tech)',
    targetAsset: 'NVDA',
    newsHeadline: 'NVIDIA Faces Potential New AI Chip Export Limits to Middle East',
    associatedMovement: 'Posible corrección de -5% a -8% en el corto plazo.',
    suggestedAction: 'Monitorear declaraciones oficiales de reguladores y proteger posiciones con opciones de venta o reducir exposición temporal.',
    status: 'Pendiente',
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

export function getAssetType(symbol) {
  if (!symbol) return 'Otros'
  const cleanSymbol = symbol.toUpperCase().trim()
  const asset = INITIAL_ASSETS.find(a => a.symbol === cleanSymbol)
  if (asset) return asset.type

  // Heuristics for unknown tickers
  if (['BTC', 'ETH', 'SOL', 'ADA', 'XRP', 'DOT', 'DOGE', 'SHIB', 'LTC', 'LINK', 'UNI', 'MATIC', 'USDT', 'USDC'].includes(cleanSymbol)) {
    return 'Criptoactivos'
  }
  if (['US10Y', 'US30Y', 'US2Y', 'LQD', 'TLT', 'IEF', 'SHY', 'BND', 'HYG'].includes(cleanSymbol)) {
    return 'Instrumentos de crédito'
  }
  if (['GLD', 'SLV', 'USO', 'UNG', 'IAU', 'DBA', 'USCI'].includes(cleanSymbol)) {
    return 'Otros'
  }
  // Default for general stocks
  return 'Acciones'
}

export function getAssetName(symbol) {
  if (!symbol) return 'Activo'
  const cleanSymbol = symbol.toUpperCase().trim()
  const asset = INITIAL_ASSETS.find(a => a.symbol === cleanSymbol)
  if (asset) return asset.name
  return `Activo ${cleanSymbol}`
}

