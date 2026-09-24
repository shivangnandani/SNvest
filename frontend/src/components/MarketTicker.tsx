import { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface MarketIndex {
  symbol: string
  name: string
  current: number
  change: number
  pct_change: number
  trend: 'up' | 'down'
}

export function MarketTicker() {
  const [indices, setIndices] = useState<MarketIndex[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchIndices = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
        const response = await fetch(`${baseUrl}/market-indices`)
        if (response.ok) {
          const data = await response.json()
          setIndices(data)
        }
      } catch (error) {
        console.error('Error fetching market indices:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchIndices()
    // Refresh every minute
    const interval = setInterval(fetchIndices, 60000)
    return () => clearInterval(interval)
  }, [])

  if (isLoading || indices.length === 0) {
    return (
      <div className="w-full h-10 border-b border-black/5 dark:border-white/5 bg-white/40 dark:bg-black/20 backdrop-blur-md flex items-center justify-center">
        <span className="text-xs text-muted-foreground animate-pulse">Loading live market data...</span>
      </div>
    )
  }

  return (
    <div className="w-full border-b border-black/5 dark:border-white/5 bg-white/60 dark:bg-white/5 backdrop-blur-md overflow-hidden flex items-center relative h-10">
      <div className="absolute left-0 w-8 h-full bg-gradient-to-r from-white dark:from-black to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 w-8 h-full bg-gradient-to-l from-white dark:from-black to-transparent z-10 pointer-events-none"></div>
      
      <div className="flex animate-[marquee_20s_linear_infinite] whitespace-nowrap items-center min-w-full hover:[animation-play-state:paused]">
        {/* Duplicate the items for seamless infinite scroll */}
        {[...indices, ...indices, ...indices].map((idx, i) => (
          <div key={`${idx.symbol}-${i}`} className="flex items-center gap-2 mx-8 text-sm font-medium">
            <span className="text-foreground/80 tracking-wide">{idx.name}</span>
            <span className="text-foreground font-semibold">{idx.current.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            <span className={`flex items-center text-xs px-1.5 py-0.5 rounded ${idx.trend === 'up' ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-red-500/10 text-red-600 dark:text-red-400'}`}>
              {idx.trend === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
              {idx.change > 0 ? '+' : ''}{idx.change.toFixed(2)} ({idx.pct_change > 0 ? '+' : ''}{idx.pct_change.toFixed(2)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
