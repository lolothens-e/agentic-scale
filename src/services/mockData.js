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
    headline: 'Los rendimientos de los bonos del Tesoro de EE.UU. caen al enfriarse la inflación más de lo esperado',
    source: 'Bloomberg',
    date: '2026-07-11T14:30:00Z',
    assets: ['US10Y', 'LQD'],
    summary: 'El índice de precios al consumidor subió un 0,1% el mes pasado, respaldando las expectativas de posibles recortes de tasas por parte de la Reserva Federal. Los precios de los bonos subieron al caer los rendimientos.',
    historicalComparison: 'Históricamente, los datos de inflación que muestran enfriamiento se correlacionan con un alza promedio del +1,2% en los precios de los bonos a 10 años y una caída de 15 puntos básicos en el rendimiento en los siguientes 3 días.',
    impact: 'Positivo',
    confidence: 88,
    explanation: 'Las menores expectativas de inflación reducen la probabilidad de tasas de interés más altas. Esto apoya directamente las valoraciones de los bonos (instrumentos de crédito) y reduce los costos de endeudamiento.',
    evidence: 'Dato del IPC en 2,9% frente al 3,1% esperado. El rendimiento a 10 años cayó instantáneamente de 4,25% a 4,12%.',
  },
  {
    id: 'news-2',
    headline: 'NVIDIA enfrenta posibles nuevos límites de exportación de chips de IA a Medio Oriente',
    source: 'Reuters',
    date: '2026-07-11T09:15:00Z',
    assets: ['NVDA'],
    summary: 'El gobierno de EE.UU. está considerando limitar las exportaciones de chips de IA avanzados de Nvidia y otros fabricantes a ciertos países de Medio Oriente por motivos de seguridad nacional.',
    historicalComparison: 'Anuncios previos de restricciones a la exportación (ej. octubre de 2023) provocaron una corrección a corto plazo de -6,5% para NVDA antes de recuperarse.',
    impact: 'Negativo',
    confidence: 75,
    explanation: 'Limita el crecimiento potencial del mercado direccionable. Aunque la demanda acumulada en EE.UU. y Europa sigue siendo alta, las limitaciones geopolíticas introducen riesgos e incertidumbre para la demanda a largo plazo.',
    evidence: 'Fuentes anónimas del Departamento de Comercio citadas por los principales canales financieros. Aún no se ha firmado ninguna política oficial.',
  },
  {
    id: 'news-3',
    headline: 'Las entradas de ETF de Bitcoin se aceleran y alcanzan los 1.200 millones de dólares en volumen semanal',
    source: 'Financial Times',
    date: '2026-07-10T18:00:00Z',
    assets: ['BTC', 'ETH'],
    summary: 'Los fondos cotizados en bolsa (ETF) de Bitcoin al contado registraron sus mayores entradas semanales en tres meses, lo que indica acumulación institucional en medio de la estabilización macroeconómica.',
    historicalComparison: 'Las semanas con entradas superiores a $1.000 millones han precedido históricamente a una apreciación del precio de BTC del +4,5% dentro de los 7 días en el 82% de los casos observados.',
    impact: 'Positivo',
    confidence: 90,
    explanation: 'La presión de compra institucional absorbe el suministro de venta, reduciendo la volatilidad y reforzando el precio base de los principales activos digitales.',
    evidence: 'Datos de entradas en las presentaciones de la SEC combinados con servicios de seguimiento de libros contables de ETF verificados.',
  },
  {
    id: 'news-4',
    headline: 'Las entregas de Tesla superan las estimaciones del segundo trimestre en medio de la expansión europea',
    source: 'Bloomberg',
    date: '2026-07-09T11:00:00Z',
    assets: ['TSLA'],
    summary: 'Tesla entregó 466.000 vehículos en el segundo trimestre, superando las estimaciones de consenso de 448.000. La producción aumentó en las gigafábricas de Berlín y Shanghái.',
    historicalComparison: 'Superar las entregas típicamente desencadena un repunte del +3,2% en el día 1, aunque los recortes de precios afectan los márgenes brutos a largo plazo.',
    impact: 'Positivo',
    confidence: 82,
    explanation: 'Demuestra una demanda de consumo resiliente y solidez operativa, lo que compensa las preocupaciones de saturación del mercado en el sector de vehículos eléctricos.',
    evidence: 'Comunicado de prensa oficial y declaraciones de relaciones con inversores de Tesla Motors.',
  },
  {
    id: 'news-5',
    headline: 'La Reserva Federal señala una postura de tasas altas por más tiempo',
    source: 'Reuters',
    date: '2026-07-08T16:00:00Z',
    assets: ['US10Y', 'AAPL', 'NVDA'],
    summary: 'Las actas de la reciente reunión del FOMC indican que los funcionarios siguen preocupados por la inflación estructural de servicios y no ven prisa por recortar las tasas de política monetaria.',
    historicalComparison: 'Las actas restrictivas de la Fed han provocado históricamente una corrección del -1,8% en las acciones de crecimiento de múltiplos altos en un plazo de 48 horas.',
    impact: 'Negativo',
    confidence: 70,
    explanation: 'Las tasas de interés persistentemente altas elevan el costo del capital, descontando el valor presente de las ganancias futuras para las acciones de crecimiento y manteniendo altos los rendimientos de los bonos.',
    evidence: 'Texto oficial de las actas de la reunión del FOMC publicado a las 2:00 PM EST.',
  },
  {
    id: 'news-6',
    headline: 'Los precios del oro alcanzan máximos históricos ante la incertidumbre geopolítica',
    source: 'Associated Press',
    date: '2026-07-10T22:30:00Z',
    assets: ['GLD'],
    summary: 'Los precios al contado del oro superaron los 2.450 dólares por onza al intensificarse la demanda de refugio seguro debido a las tensiones comerciales entre bloques económicos mundiales.',
    historicalComparison: 'Los máximos del precio del oro al contado se correlacionan con una caída en el apetito general por el riesgo, empujando los ratios acciones/oro a mínimos de 18 meses.',
    impact: 'Positivo',
    confidence: 85,
    explanation: 'Los activos de refugio seguro se benefician de la incertidumbre y de los riesgos de depreciación de las monedas fiat, atrayendo capital minorista conservador y de bancos centrales.',
    evidence: 'Datos del mercado de oro al contado e informes de precios de COMEX.',
  },
  {
    id: 'news-7',
    headline: 'Las acciones de Tesla fluctúan tras los ajustes de producción en la fábrica de Berlín',
    source: 'Bloomberg',
    date: '2026-06-30T10:00:00Z',
    assets: ['TSLA'],
    summary: 'Tesla modificó sus calendarios de producción en Europa para integrar nuevas líneas de montaje de paquetes de baterías, lo que provocó ajustes temporales en las entregas de los Model Y fabricados en Berlín.',
    historicalComparison: 'Las pausas de producción por actualizaciones crean históricamente preocupaciones de caídas en entregas a corto plazo, resultando en correcciones de -3% seguidas por fuertes alzas.',
    impact: 'Neutral',
    confidence: 70,
    explanation: 'Los cierres operativos temporales son descontados por los analistas pero activan ventas automáticas de minoristas. Los aumentos de capacidad a largo plazo compensan los retrasos temporales.',
    evidence: 'Boletín de la fábrica de Berlín y registros de entrega de proveedores regionales.',
  },
  {
    id: 'news-8',
    headline: 'La actividad de la red de Capa 2 de Ethereum aumenta a transacciones récord',
    source: 'Reuters',
    date: '2026-06-01T15:00:00Z',
    assets: ['ETH'],
    summary: 'Los volúmenes agregados de transacciones en las principales redes de rollup de Ethereum alcanzaron un máximo histórico de 140 transacciones por segundo, reduciendo las tarifas de gas promedio.',
    historicalComparison: 'Los picos de actividad de Capa 2 preceden a la acumulación de ether por parte de los enrutadores de aplicaciones descentralizadas en 10 a 15 días.',
    impact: 'Positivo',
    confidence: 85,
    explanation: 'El aumento del uso demuestra una fuerte demanda orgánica para el ecosistema. Tarifas más bajas atraen volumen de usuarios minoristas, reforzando la utilidad del token nativo.',
    evidence: 'Métricas de exploradores en cadena y tableros de seguimiento de uso de gas de Capa 2.',
  },
  {
    id: 'news-9',
    headline: 'La emisión de bonos corporativos de EE.UU. se desacelera tras las alzas de rendimiento',
    source: 'Financial Times',
    date: '2026-06-25T11:00:00Z',
    assets: ['LQD'],
    summary: 'Los emisores corporativos de alta calificación retrasaron importantes ventas de bonos al expandirse los diferenciales de rendimiento corporativo, esperando un entorno macroeconómico más estable.',
    historicalComparison: 'Las desaceleraciones en la emisión de bonos se correlacionan con breves aumentos en el valor de los ETF de bonos debido a la menor oferta de deuda nueva en el mercado secundario.',
    impact: 'Negativo',
    confidence: 78,
    explanation: 'Los rendimientos más altos aumentan los costos de endeudamiento corporativo, lo que indica una posible compresión del margen para emisores muy endeudados pero estabiliza las corporaciones con mucha liquidez.',
    evidence: 'Filings de registro de deuda de la SEC compilados por las principales plataformas de renta fija.',
  },
  {
    id: 'news-10',
    headline: 'Los bancos centrales aceleran las compras de oro para diversificar reservas',
    source: 'Financial Times',
    date: '2026-05-15T09:00:00Z',
    assets: ['GLD'],
    summary: 'Las autoridades monetarias mundiales aumentaron la acumulación de lingotes de oro en un 15% interanual, citando la cobertura contra la inflación y la estrategia de protección de activos geopolíticos.',
    historicalComparison: 'Las compras netas de los bancos centrales han apoyado históricamente un sólido piso de precios para los futuros del oro, lo que lleva a ganancias de más del +8,5% en 12 meses.',
    impact: 'Positivo',
    confidence: 92,
    explanation: 'Las compras institucionales sostenidas retiran el suministro físico del mercado, consolidando al oro como el último depósito de valor en tiempos de volatilidad cambiaria.',
    evidence: 'Informe trimestral de reservas del Consejo Mundial del Oro y registros de compras del FMI.',
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

