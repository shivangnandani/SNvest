import { TrendingUp, TrendingDown, Clock, Building2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import type { PredictionData } from '../lib/mockData'

interface RecentPredictionsProps {
  predictions: PredictionData[]
}

export function RecentPredictions({ predictions }: RecentPredictionsProps) {
  if (predictions.length === 0) return null;

  const formatPrice = (price: number, currency: string | undefined) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      maximumFractionDigits: price % 1 === 0 ? 0 : 2
    }).format(price);
  }

  return (
    <div className="mt-16 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold tracking-tight">Recent Predictions</h3>
          <p className="text-sm text-muted-foreground">History of stock forecasts from your current session.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {predictions.map((data, i) => {
          if (!data.chartData || data.chartData.length === 0) return null;
          
          const latestActual = data.chartData[data.chartData.length - 1].actual
          const latestPredicted = data.chartData[data.chartData.length - 1].predicted
          const firstActual = data.chartData[0].actual
          
          const changeVal = ((latestActual - firstActual) / firstActual) * 100
          const trend = changeVal >= 0 ? "up" : "down"
          

          const latestDateRaw = data.chartData[data.chartData.length - 1].date
          const parsedDate = new Date(latestDateRaw)
          const dateStr = parsedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          
          const firstDateRaw = data.chartData[0].date
          const firstDateStr = new Date(firstDateRaw).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          
          return (
            <Card key={i} className="group overflow-hidden border-border/40 bg-card/50 backdrop-blur-sm transition-all hover:bg-card/80 hover:shadow-lg hover:-translate-y-0.5">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-sm truncate">{data.stockName}</h4>
                    <p className="text-[10px] font-mono text-muted-foreground uppercase truncate">
                      {firstDateStr} to {dateStr}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <div className="space-y-0.5">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Actual</p>
                      <p className="text-sm font-mono font-bold">{formatPrice(latestActual, data.currency)}</p>
                    </div>
                    <div className={`flex items-center gap-1 text-[10px] font-bold ${trend === 'up' ? 'text-green-500' : 'text-rose-500'}`}>
                      {trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {changeVal >= 0 ? '+' : ''}{changeVal.toFixed(2)}%
                    </div>
                  </div>

                  <div className="h-px bg-border/40" />

                  <div className="flex justify-between items-center">
                    <div className="space-y-0.5">
                      <p className="text-[10px] uppercase tracking-wider text-primary/80 font-bold">AI Forecast</p>
                      <p className="text-sm font-mono font-black text-primary">{formatPrice(latestPredicted, data.currency)}</p>
                    </div>
                    <div className="flex items-center gap-1 text-[9px] text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
                      <Clock className="h-3 w-3" />
                      {dateStr}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
