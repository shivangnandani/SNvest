export interface ChartDataPoint {
  date: string
  actual: number
  predicted: number
}

export interface PredictionData {
  stockName: string
  startDate: string
  endDate: string
  currency?: string
  chartData: ChartDataPoint[]
  futureDate?: string
  futurePrediction?: number
  futureOpen?: number
  futureClose?: number
  futureTrend?: string
  generatedAt?: string
}

// Seed-based random for consistent results per stock
function seededRandom(seed: string) {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  
  return function() {
    hash = (hash * 1103515245 + 12345) & 0x7fffffff
    return hash / 0x7fffffff
  }
}

// Base prices for common stocks (mock data)
const basePrices: Record<string, number> = {
  'AAPL': 175,
  'GOOGL': 140,
  'MSFT': 380,
  'AMZN': 175,
  'TSLA': 250,
  'META': 485,
  'NVDA': 875,
  'JPM': 195,
  'V': 280,
  'JNJ': 160,
}

export function generateMockPredictionData(stockName: string, startDate: string): PredictionData {
  const random = seededRandom(stockName + startDate)
  
  // Get base price or generate one
  const basePrice = basePrices[stockName] || (50 + random() * 200)
  
  const start = new Date(startDate)
  const end = new Date()
  const daysDiff = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  
  // Limit to max 120 data points for readability
  const dataPoints = Math.min(daysDiff, 120)
  const interval = Math.max(1, Math.floor(daysDiff / dataPoints))
  
  const chartData: ChartDataPoint[] = []
  
  let currentActual = basePrice
  let trend = (random() - 0.5) * 0.02 // Random overall trend
  
  for (let i = 0; i <= dataPoints; i++) {
    const currentDate = new Date(start)
    currentDate.setDate(start.getDate() + (i * interval))
    
    // Skip weekends for more realistic data
    const dayOfWeek = currentDate.getDay()
    if (dayOfWeek === 0 || dayOfWeek === 6) continue
    
    // Simulate price movement with volatility
    const volatility = 0.02
    const dailyChange = (random() - 0.5) * volatility * currentActual
    const trendChange = trend * currentActual
    
    currentActual = Math.max(1, currentActual + dailyChange + trendChange)
    
    // Predicted price follows actual with some error (simulating model prediction)
    const predictionError = (random() - 0.5) * 0.03 * currentActual
    const predicted = currentActual + predictionError
    
    // Occasionally adjust trend
    if (random() > 0.9) {
      trend = (random() - 0.5) * 0.02
    }
    
    chartData.push({
      date: currentDate.toISOString().split('T')[0],
      actual: parseFloat(currentActual.toFixed(2)),
      predicted: parseFloat(predicted.toFixed(2)),
    })
  }
  
  return {
    stockName,
    startDate,
    endDate: end.toISOString().split('T')[0],
    chartData,
  }
}
