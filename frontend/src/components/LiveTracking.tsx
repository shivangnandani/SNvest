import { useState } from 'react'
import { StockPredictionForm } from './StockPredictionForm'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'

export function LiveTracking() {
  const [predictionData, setPredictionData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePredict = async (stockName: string, startDate: string) => {
    setIsLoading(true)
    setError(null)
    setPredictionData(null)

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const response = await fetch(`${baseUrl}/predict-daily`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ticker: stockName, start_date: startDate }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch predictions');
      }

      const rawData = await response.json();

      setPredictionData({
        stockName: stockName,
        currency: rawData.currency || 'USD',
        historical: rawData.historical,
      })

    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching predictions.')
    } finally {
      setIsLoading(false)
    }
  }

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: predictionData?.currency || 'USD',
  })

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto space-y-10 px-4 sm:px-6">
      <section className="text-center">
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl text-balance">
          Live Day Active Predictions
        </h1>
        <p className="mx-auto max-w-2xl text-muted-foreground text-balance">
          Track today's live market performance against our AI's session predictions.
        </p>
      </section>

      <section>
        <StockPredictionForm onPredict={handlePredict} isLoading={isLoading} />
      </section>

      {error && (
        <div className="rounded-lg bg-destructive/10 p-4 text-destructive border border-destructive/20 text-center">
          {error}
        </div>
      )}

      {predictionData && (
        <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
          {(() => {
            const histDates = predictionData.historical?.dates || [];
            if (histDates.length === 0) return <div className="text-center text-muted-foreground">No historical data available.</div>;
            
            const lastHistDateStr = histDates[histDates.length - 1];
            
            const now = new Date();
            const utcHours = now.getUTCHours();
            const utcMinutes = now.getUTCMinutes();
            const istTotalMinutes = (utcHours * 60) + utcMinutes + 330;
            const istHour = Math.floor(istTotalMinutes / 60) % 24;
            const istMinute = istTotalMinutes % 60;
            const isMarketClosed = istHour > 15 || (istHour === 15 && istMinute >= 30);
            
            // Check if the last historical date is today's date in local timezone
            const lastDateObj = new Date(lastHistDateStr);
            if (lastDateObj.toDateString() !== now.toDateString()) {
                return (
                    <Card className="border-border shadow-sm p-8 text-center bg-muted/20">
                        <h3 className="text-xl font-bold mb-2">Market Not Active Today</h3>
                        <p className="text-muted-foreground text-sm">
                            The live tracking feature is only available during active trading days for the requested asset. 
                            The last recorded data point was on {lastDateObj.toLocaleDateString()}.
                        </p>
                    </Card>
                )
            }

            const tOpen = predictionData.historical.open[histDates.length - 1];
            const tClose = predictionData.historical.close[histDates.length - 1];
            const pOpen = predictionData.historical.predicted_open[histDates.length - 1];
            const pClose = predictionData.historical.predicted_close[histDates.length - 1];
            
            const errorOpen = Math.abs(pOpen - tOpen) / tOpen * 100;
            const errorClose = Math.abs(pClose - tClose) / tClose * 100;

            return (
              <section className="mt-8">
                <div className="flex items-center gap-4 mb-6">
                    <h2 className="text-2xl font-black tracking-tight">{predictionData.stockName}</h2>
                    <div className="px-3 py-1 rounded-md bg-muted text-[10px] font-bold text-muted-foreground uppercase tracking-widest border border-border">
                        {now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                </div>

                <Card className="border-primary/20 bg-primary/5 shadow-xl">
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex items-center gap-2 mb-8 border-b border-border/50 pb-4">
                      <div className={`w-2.5 h-2.5 rounded-full ${isMarketClosed ? 'bg-muted-foreground' : 'bg-red-500 animate-pulse'}`}></div>
                      <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">Live Tracking Feed</h3>
                      <span className="ml-auto text-xs font-semibold text-muted-foreground bg-background px-3 py-1 rounded-full border border-border/50 shadow-sm">{isMarketClosed ? 'Market Closed' : 'Live Data Active'}</span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="bg-background rounded-2xl p-5 border border-border/50 shadow-sm flex flex-col justify-between">
                        <span className="text-xs uppercase text-muted-foreground font-bold mb-2 flex items-center gap-2">
                            Predicted Open
                        </span>
                        <div className="text-2xl sm:text-3xl font-mono font-black">{formatter.format(pOpen)}</div>
                      </div>
                      
                      <div className="hidden lg:flex items-center justify-center -mx-4 z-10 text-muted-foreground">
                        <ArrowRight className="w-5 h-5 opacity-50" />
                      </div>

                      <div className="bg-background rounded-2xl p-5 border-2 border-blue-500/30 relative overflow-hidden shadow-md flex flex-col justify-between">
                        <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-blue-500"></div>
                        <span className="text-xs uppercase text-muted-foreground font-bold mb-2 flex items-center gap-2">
                            Actual Open
                        </span>
                        <div className="text-2xl sm:text-3xl font-mono font-black text-foreground">{formatter.format(tOpen)}</div>
                        <div className="text-xs font-semibold text-muted-foreground mt-3 bg-muted/50 w-fit px-2 py-1 rounded">Error: {errorOpen.toFixed(2)}%</div>
                      </div>
                      
                      <div className="hidden lg:block col-span-4 h-px bg-border/50 my-2"></div>

                      <div className="bg-background rounded-2xl p-5 border border-border/50 shadow-sm flex flex-col justify-between">
                        <span className="text-xs uppercase text-muted-foreground font-bold mb-2 flex items-center gap-2">
                            Predicted Close
                        </span>
                        <div className="text-2xl sm:text-3xl font-mono font-black">{formatter.format(pClose)}</div>
                      </div>

                      <div className="hidden lg:flex items-center justify-center -mx-4 z-10 text-muted-foreground">
                        <ArrowRight className="w-5 h-5 opacity-50" />
                      </div>

                      <div className="bg-background rounded-2xl p-5 border-2 border-emerald-500/30 relative overflow-hidden shadow-md flex flex-col justify-between">
                        <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-emerald-500"></div>
                        <span className="text-xs uppercase text-emerald-500/80 font-bold mb-2 flex items-center gap-2">
                            Live / Actual Close
                        </span>
                        <div className="text-2xl sm:text-3xl font-mono font-black text-foreground">{formatter.format(tClose)}</div>
                        <div className="text-xs font-semibold text-muted-foreground mt-3 bg-muted/50 w-fit px-2 py-1 rounded">Error: {errorClose.toFixed(2)}%</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>
            )
          })()}
        </div>
      )}
    </div>
  )
}
