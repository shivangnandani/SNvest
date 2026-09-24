import { useState } from 'react'
import { StockPredictionForm } from './StockPredictionForm'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { TrendingUp, TrendingDown, X } from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface FuturePredictionProps {
  predictionDataOverride?: any;
}

export function FuturePrediction({ predictionDataOverride }: FuturePredictionProps) {
  const [predictionData, setPredictionData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  
  // Use override if provided, otherwise use local state
  const activeData = predictionDataOverride || predictionData;

  const handlePredict = async (stockName: string, startDate: string) => {
    if (predictionDataOverride) return;
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
        forecast: rawData.forecast,
        currentPrice: rawData.current_price,
        generatedAt: rawData.generated_at
      })

    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false)
    }
  }

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: activeData?.currency || 'USD',
  })

  // Prepare chart data combining historical and forecast
  const chartData = []
  if (activeData) {
    const { historical, forecast } = activeData;
    for (let i = 0; i < historical.dates.length; i++) {
      chartData.push({
        date: historical.dates[i],
        actual: historical.close[i],
        predicted: null
      })
    }
    // Add forecast
    for (let i = 0; i < forecast.length; i++) {
      chartData.push({
        date: forecast[i].date,
        actual: null,
        predicted: forecast[i].close
      })
    }
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto space-y-10 px-4 sm:px-6">
      {!predictionDataOverride && (
        <>
          <section className="text-center">
            <h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl text-balance">
              7-Day Strategic Forecast
            </h1>
            <p className="mx-auto max-w-2xl text-muted-foreground text-balance">
              Aggressive multi-step prediction engine for the next 7 trading days.
            </p>
          </section>

          <section>
            <StockPredictionForm onPredict={handlePredict} isLoading={isLoading} />
          </section>
        </>
      )}

      {error && (
        <div className="rounded-md bg-destructive/15 p-4 text-sm text-destructive text-center">
          {error}
        </div>
      )}

      {activeData && activeData.forecast && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          
          {/* Main Next Day Card */}
          <section className="flex justify-center pt-4">
            <Card className="w-full max-w-md overflow-hidden border-border bg-card shadow-xl transition-all hover:shadow-2xl">
              <CardContent className="p-8">
                {(() => {
                  const nextDay = activeData.forecast[0];
                  const isBullish = nextDay.trend === 'UP';
                  const accentColor = isBullish ? 'text-emerald-500' : 'text-red-500';
                  const accentBg = isBullish ? 'bg-emerald-500/10' : 'bg-red-500/10';
                  const ArrowIcon = isBullish ? TrendingUp : TrendingDown;

                  const nextDayDate = new Date(nextDay.date);
                  const now = new Date();
                  const isTodayDate = nextDayDate.toDateString() === now.toDateString();
                  
                  // Calculate IST time (UTC + 5:30)
                  const utcHours = now.getUTCHours();
                  const utcMinutes = now.getUTCMinutes();
                  const istTotalMinutes = (utcHours * 60) + utcMinutes + 330; // 330 mins = 5.5 hours
                  const istHour = Math.floor(istTotalMinutes / 60) % 24;
                  const istMinute = istTotalMinutes % 60;
                  
                  // Market closes at 15:30 IST
                  const isMarketClosed = istHour > 15 || (istHour === 15 && istMinute >= 30);
                  
                  const targetTitle = (isTodayDate && !isMarketClosed) ? "Today's Prediction" : "Next Session Prediction";

                  return (
                    <>
                      <div className="flex items-start justify-between mb-8">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${accentBg} ${accentColor}`}>
                              <ArrowIcon className="h-4 w-4" />
                            </div>
                            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground uppercase">
                              {activeData.stockName}
                            </h2>
                          </div>
                          <p className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-10">
                            {targetTitle}
                          </p>
                        </div>
                        <div className="px-3 py-1 rounded-md bg-muted text-[10px] font-bold text-muted-foreground uppercase tracking-widest border border-border">
                          {new Date(nextDay.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 sm:gap-4">
                        <div className="flex flex-col items-center bg-muted/30 rounded-2xl py-4 sm:py-6 px-2 sm:px-4 border border-border/50">
                          <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] mb-2 text-muted-foreground text-center`}>
                            Projected Open
                          </span>
                          <p className="text-lg sm:text-3xl font-black text-foreground tracking-tighter tabular-nums drop-shadow-sm">
                            {formatter.format(nextDay.open)}
                          </p>
                        </div>
                        <div className="flex flex-col items-center bg-muted/30 rounded-2xl py-4 sm:py-6 px-2 sm:px-4 border border-border/50">
                          <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] mb-2 ${accentColor} text-center`}>
                            Projected Close
                          </span>
                          <p className="text-lg sm:text-3xl font-black text-foreground tracking-tighter tabular-nums drop-shadow-sm">
                            {formatter.format(nextDay.close)}
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setShowHistoryModal(true)}
                        className="mt-6 w-full py-2.5 rounded-xl border-2 border-dashed border-primary/20 text-primary/80 text-xs font-bold uppercase tracking-wider hover:bg-primary/5 hover:border-primary/40 transition-colors"
                      >
                        View Actual Past 7 Days
                      </button>
                    </>
                  );
                })()}
              </CardContent>
            </Card>
          </section>


          {/* 7 Day Chart */}
          <Card className="border-border shadow-lg">
            <CardHeader>
              <CardTitle>30-Day History & 7-Day Forecast</CardTitle>
              <CardDescription>Visual trend projection</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                    <XAxis 
                      dataKey="date" 
                      tick={{fontSize: 10}} 
                      tickFormatter={(v) => new Date(v).toLocaleDateString('en-US', {month:'short', day:'numeric'})} 
                    />
                    <YAxis tick={{fontSize: 10}} domain={['auto', 'auto']} tickFormatter={(v) => formatter.format(v)} />
                    <Tooltip 
                      formatter={(val: any, name: any) => [formatter.format(val), name === 'actual' ? 'Actual' : 'Predicted']}
                      labelFormatter={(l) => new Date(l).toLocaleDateString()}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="actual" stroke="#8884d8" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="predicted" stroke="#82ca9d" strokeWidth={2} strokeDasharray="5 5" dot={true} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* 7 Day Forecast Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {activeData.forecast.map((day: any, i: number) => {
              const isBullish = day.trend === 'UP';
              const Icon = isBullish ? TrendingUp : TrendingDown;
              const color = isBullish ? 'text-emerald-500' : 'text-red-500';
              
              return (
                <Card key={i} className="bg-card">
                  <CardContent className="p-3 sm:p-4 flex flex-col items-center text-center">
                    <div className="text-[10px] sm:text-xs font-bold text-muted-foreground mb-1.5 sm:mb-2">{new Date(day.date).toLocaleDateString('en-US', {weekday:'short', month:'short', day:'numeric'})}</div>
                    <div className={`flex items-center gap-1 mb-2 sm:mb-3 ${color}`}>
                      <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="text-[11px] sm:text-sm font-bold uppercase">{day.trend}</span>
                    </div>
                    <div className="w-full grid grid-cols-2 gap-1.5 sm:gap-2 text-center">
                      <div className="bg-muted/30 rounded-md p-1.5 sm:p-2 border border-border/50">
                        <div className="text-[8px] sm:text-[9px] font-bold text-muted-foreground uppercase mb-0.5">Open</div>
                        <div className="text-[9px] sm:text-xs font-semibold tabular-nums tracking-tighter">{formatter.format(day.open)}</div>
                      </div>
                      <div className="bg-muted/30 rounded-md p-1.5 sm:p-2 border border-border/50">
                        <div className="text-[8px] sm:text-[9px] font-bold text-muted-foreground uppercase mb-0.5">Close</div>
                        <div className="text-[9px] sm:text-xs font-semibold tabular-nums tracking-tighter">{formatter.format(day.close)}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

        </div>
      )}

      {/* History Modal */}
      {showHistoryModal && activeData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-lg shadow-2xl border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4">
              <CardTitle>Past 7 Days History</CardTitle>
              <button onClick={() => setShowHistoryModal(false)} className="p-1 rounded-full hover:bg-muted transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {(() => {
                  const histLen = activeData.historical?.dates?.length || 0;
                  if (histLen === 0) return <div className="p-8 text-center text-muted-foreground">No historical data available.</div>;
                  
                  const last7Dates = activeData.historical.dates.slice(Math.max(0, histLen - 7));
                  const last7Open = activeData.historical.open?.slice(Math.max(0, histLen - 7)) || Array(7).fill(0);
                  const last7Close = activeData.historical.close.slice(Math.max(0, histLen - 7));
                  const last7PredClose = activeData.historical.predicted_close?.slice(Math.max(0, histLen - 7)) || Array(7).fill(0);
                  const last7PredOpen = activeData.historical.predicted_open?.slice(Math.max(0, histLen - 7)) || Array(7).fill(0);
                  
                  // Reverse to show most recent at the top
                  return last7Dates.map((dateStr: string, idx: number) => {
                    const actualIdx = last7Dates.length - 1 - idx;
                    const dStr = last7Dates[actualIdx];
                    const open = last7Open[actualIdx];
                    const close = last7Close[actualIdx];
                    const predClose = last7PredClose[actualIdx];
                    const predOpen = last7PredOpen[actualIdx];
                    const isUp = close >= open;
                    const predIsUp = predClose >= predOpen;
                    const errorClose = Math.abs(predClose - close) / close * 100;
                    const errorOpen = Math.abs(predOpen - open) / open * 100;
                    
                    return (
                      <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 hover:bg-muted/10 transition-colors gap-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold">{new Date(dStr).toLocaleDateString('en-US', {weekday:'short', month:'short', day:'numeric'})}</span>
                          <span className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wider">Performance</span>
                        </div>
                        <div className="grid grid-cols-2 sm:flex sm:items-center gap-3 sm:gap-6 w-full sm:w-auto mt-2 sm:mt-0">
                          <div className="text-left sm:text-right">
                            <span className="text-[10px] text-muted-foreground uppercase block mb-0.5">Actual Open</span>
                            <span className="text-xs sm:text-sm font-mono">{formatter.format(open)}</span>
                          </div>
                          <div className="text-left sm:text-right sm:border-r sm:border-border/50 sm:pr-4">
                            <span className="text-[10px] text-muted-foreground uppercase block mb-0.5">Actual Close</span>
                            <span className={`text-xs sm:text-sm font-mono font-bold ${isUp ? 'text-emerald-500' : 'text-red-500'}`}>
                              {formatter.format(close)}
                            </span>
                          </div>
                          
                          <div className="text-left sm:text-right">
                            <span className="text-[10px] text-primary/80 uppercase block mb-0.5 font-bold">Pred Open</span>
                            <div className="flex flex-col sm:items-end">
                               <span className="text-xs sm:text-sm font-mono">{formatter.format(predOpen)}</span>
                               {predOpen > 0 && <span className="text-[9px] text-muted-foreground">{errorOpen.toFixed(1)}% err</span>}
                            </div>
                          </div>
                          <div className="text-left sm:text-right">
                            <span className="text-[10px] text-primary/80 uppercase block mb-0.5 font-bold">Pred Close</span>
                            <div className="flex flex-col sm:items-end">
                               <span className={`text-xs sm:text-sm font-mono font-bold ${predIsUp ? 'text-emerald-500/80' : 'text-red-500/80'}`}>{formatter.format(predClose)}</span>
                               {predClose > 0 && <span className="text-[9px] text-muted-foreground">{errorClose.toFixed(1)}% err</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  });
                })()}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
