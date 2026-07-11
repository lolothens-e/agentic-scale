import './App.css'

const filters = [
  { label: 'Relevancy', value: 'High to low' },
  { label: 'Recentness', value: 'Last 24 hours' },
  { label: 'Source trustworthiness', value: 'Verified sources first' },
]

const stories = [
  {
    asset: 'NVIDIA (NVDA)',
    source: 'Reuters',
    trust: '9.4/10',
    headline: 'AI chip export rules may tighten in key markets',
    sentiment: 'Cautious',
    advice:
      'Expect short-term volatility for semiconductor names; hedge concentrated exposure and watch policy updates before adding risk.',
  },
  {
    asset: 'Bitcoin (BTC)',
    source: 'Bloomberg',
    trust: '9.1/10',
    headline: 'ETF inflows accelerate as macro risk appetite improves',
    sentiment: 'Positive',
    advice:
      'Momentum supports upside, but entries are safer on pullbacks near support with strict position sizing due to crypto drawdown risk.',
  },
  {
    asset: 'Tesla (TSLA)',
    source: 'Financial Times',
    trust: '8.8/10',
    headline: 'EV pricing pressure persists amid new competitor launches',
    sentiment: 'Mixed',
    advice:
      'Margin pressure can weigh on near-term outlook; prioritize confirmation from delivery trends and gross margin stabilization.',
  },
]

const watchlistImpact = [
  {
    watchlist: 'Growth Tech',
    effect: 'Moderate downside risk',
    note: 'Chip policy and valuation sensitivity may increase drawdowns over the next 1-2 weeks.',
  },
  {
    watchlist: 'Digital Assets',
    effect: 'Constructive momentum',
    note: 'Stronger ETF demand improves sentiment, but liquidity shocks remain a key risk.',
  },
]

const assetSummary = {
  target: 'NVIDIA (NVDA)',
  relevantStories: [
    'Potential export restrictions on advanced AI accelerators',
    'Cloud demand remains resilient in latest enterprise checks',
    'Supply chain lead times are improving for high-end GPUs',
  ],
  sentiment: 'Slightly Bullish with policy risk overhang',
  researchAdvice:
    'Track export-policy headlines, hyperscaler capex guidance, and next earnings call commentary to confirm whether demand offsets regulatory drag.',
}

function App() {
  return (
    <div className="dashboard">
      <header className="panel header-panel">
        <h1>MarketScope</h1>
        <p>
          Google Finance-inspired layout for investable assets: stocks, crypto, and
          broader market news intelligence.
        </p>
      </header>

      <section className="panel filter-panel" aria-label="News filters">
        <h2>News Filters</h2>
        <div className="filters">
          {filters.map((filter) => (
            <label key={filter.label}>
              <span>{filter.label}</span>
              <select defaultValue={filter.value}>
                <option>{filter.value}</option>
                <option>Balanced</option>
                <option>Most conservative</option>
              </select>
            </label>
          ))}
        </div>
      </section>

      <main className="content-grid">
        <section className="panel">
          <h2>Asset & Market Stories</h2>
          <ul className="story-list">
            {stories.map((story) => (
              <li key={story.headline} className="story-card">
                <div className="story-meta">
                  <strong>{story.asset}</strong>
                  <span>
                    {story.source} · Trust score {story.trust}
                  </span>
                </div>
                <h3>{story.headline}</h3>
                <p>
                  Sentiment: <strong>{story.sentiment}</strong>
                </p>
                <p className="advice">AI advice: {story.advice}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="panel insight-panel">
          <article>
            <h2>Watchlist Impact</h2>
            <ul>
              {watchlistImpact.map((item) => (
                <li key={item.watchlist}>
                  <strong>{item.watchlist}:</strong> {item.effect}
                  <p>{item.note}</p>
                </li>
              ))}
            </ul>
          </article>

          <article>
            <h2>Asset / Watchlist Summary</h2>
            <p>
              <strong>Focus:</strong> {assetSummary.target}
            </p>
            <h3>Relevant stories</h3>
            <ul>
              {assetSummary.relevantStories.map((story) => (
                <li key={story}>{story}</li>
              ))}
            </ul>
            <p>
              <strong>Expected sentiment:</strong> {assetSummary.sentiment}
            </p>
            <p>
              <strong>Research advice:</strong> {assetSummary.researchAdvice}
            </p>
          </article>
        </section>
      </main>
    </div>
  )
}

export default App
