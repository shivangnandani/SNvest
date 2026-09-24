import { TrendingUp, TrendingDown, Activity, Target } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import type { PredictionData } from '../lib/mockData'

interface StockInfoProps {
  data: PredictionData
}

export function StockInfo({ data }: StockInfoProps) {
  const latestActual = data.chartData[data.chartData.length - 1].actual
  const latestPredicted = data.chartData[data.chartData.length - 1].predicted
  
  const predictionError = Math.abs(((latestPredicted - latestActual) / latestActual) * 100)
  
  const isPositive = data.futureTrend === 'UP'
  
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: data.currency || 'USD',
  })

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card className="border-border shadow-md">
        <CardContent className="flex items-center gap-4 py-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Activity className="h-6 w-6 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-muted-foreground whitespace-nowrap">Future Open</p>
            <p className="text-xl font-bold text-foreground truncate">
              {data.futureOpen ? formatter.format(data.futureOpen) : 'N/A'}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border shadow-md">
        <CardContent className="flex items-center gap-4 py-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-1/10">
            {isPositive ? (
              <TrendingUp className="h-6 w-6 text-chart-1" />
            ) : (
              <TrendingDown className="h-6 w-6 text-destructive" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-muted-foreground whitespace-nowrap">Future Close</p>
            <p className="text-xl font-bold text-foreground truncate">
              {data.futureClose ? formatter.format(data.futureClose) : 'N/A'}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border shadow-md">
        <CardContent className="flex items-center gap-4 py-4">
          <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${isPositive ? 'bg-chart-1/10' : 'bg-destructive/10'}`}>
            {isPositive ? (
              <TrendingUp className="h-6 w-6 text-chart-1" />
            ) : (
              <TrendingDown className="h-6 w-6 text-destructive" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-muted-foreground whitespace-nowrap">Future Trend</p>
            <p className={`text-xl font-bold truncate ${isPositive ? 'text-chart-1' : 'text-destructive'}`}>
              {data.futureTrend || 'N/A'}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border shadow-md">
        <CardContent className="flex items-center gap-4 py-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-2/10">
            <Target className="h-6 w-6 text-chart-2" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-muted-foreground whitespace-nowrap">Model Accuracy</p>
            <p className="text-xl font-bold text-foreground truncate">
              {(100 - predictionError).toFixed(1)}%
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
