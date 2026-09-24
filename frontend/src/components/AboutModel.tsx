import { Cpu, Layers, Activity, Database, TrendingUp, ShieldCheck } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export function AboutModel() {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <section className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl text-balance">
          About Our AI Architecture
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground text-balance">
          Explore the dual-engine machine learning pipeline that drives our instantaneous forecasting platform.
        </p>
      </section>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:shadow-md">
          <CardHeader>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Cpu className="h-5 w-5" />
            </div>
            <CardTitle>Random Forest Ensembles</CardTitle>
            <CardDescription>Parallel Decision Trees</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Our core prediction engine runs on Scikit-Learn's RandomForestRegressor. By generating dozens of independent decision trees in parallel, the model effectively eliminates outlier noise and outputs highly stable consensus predictions.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:shadow-md">
          <CardHeader>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
              <Layers className="h-5 w-5" />
            </div>
            <CardTitle>Dual-Timeframe Processing</CardTitle>
            <CardDescription>Micro & Macro Forecasting</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We deploy two distinct models: an intraday engine analyzing 30-day 1-minute intervals for immediate scalping targets, and a strategic daily engine utilizing 2 years of history for aggressive 7-day multi-step recursive forecasting.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:shadow-md">
          <CardHeader>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10 text-green-500">
              <Activity className="h-5 w-5" />
            </div>
            <CardTitle>Lagged Feature Engineering</CardTitle>
            <CardDescription>Momentum Vectoring</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Raw time-series data is algorithmically transformed into staggered arrays (Lags). By feeding the model the explicit Open and Close arrays of the last 10 periods simultaneously, it inherently maps out volatility and momentum trajectories.
            </p>
          </CardContent>
        </Card>
      </div>

      <section className="rounded-3xl border border-border bg-gradient-to-br from-primary/5 via-background to-card p-8 md:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="grid gap-12 md:grid-cols-2 lg:items-center relative z-10">
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-2 tracking-tight">Data Pipeline</h3>
              <p className="text-sm text-muted-foreground">Our methodology bypasses standard rate limits through aggressive local chunking and on-the-fly multi-output training.</p>
            </div>

            <div className="grid gap-4">
              {[
                {
                  icon: Database,
                  title: "Persistent CSV Caching",
                  desc: "To bypass strict 8-day API limits on 1-minute intraday data, our backend seamlessly chunks history in 5-day intervals backwards and dynamically concats them into a permanent local 30-day database.",
                  color: "text-blue-500",
                  bg: "bg-blue-500/10"
                },
                {
                  icon: TrendingUp,
                  title: "Multi-Output Trees",
                  desc: "Rather than isolating parameters, our regressor utilizes multi-output arrays to predict both Future Open and Future Close targets in the same branch, allowing it to natively establish Future Trend logic.",
                  color: "text-primary",
                  bg: "bg-primary/10"
                },
                {
                  icon: ShieldCheck,
                  title: "Recursive Feed-Forward",
                  desc: "For the 7-day model, the engine recursively injects Day 1's generated predictions back into its own lagged context window to dynamically forecast Day 2, repeating up to a full week.",
                  color: "text-green-500",
                  bg: "bg-green-500/10"
                }
              ].map((item, i) => (
                <div key={i} className="group flex gap-4 rounded-2xl border border-border/50 bg-background/40 p-4 transition-all hover:border-border hover:bg-background/60 hover:shadow-sm">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.bg} ${item.color} transition-transform group-hover:scale-110`}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">{item.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-primary/20 via-blue-500/20 to-green-500/20 opacity-0 blur transition duration-500 group-hover:opacity-100" />
            <div className="relative aspect-video rounded-2xl bg-zinc-950 border border-border/50 flex flex-col items-center justify-center overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

              <div className="w-full px-8 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Estimators Active</span>
                    <div className="flex items-center gap-1 ml-2">
                      {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                        <div key={i} className="w-1 bg-green-500/40 animate-pulse" style={{ height: `${8 + Math.random() * 8}px`, animationDelay: `${i * 100}ms` }} />
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex items-center gap-1.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                      <span className="text-[9px] font-mono text-zinc-400">Tree Nodes</span>
                    </div>
                  </div>
                </div>

                <div className="h-32 w-full flex items-end gap-[3px] pt-4 relative">
                  <svg className="absolute inset-x-0 bottom-0 w-full h-24 opacity-30 px-2" viewBox="0 0 400 100" preserveAspectRatio="none">
                    <line x1="0" y1="20" x2="400" y2="20" stroke="currentColor" strokeWidth="0.5" className="text-zinc-700" />
                    <line x1="0" y1="50" x2="400" y2="50" stroke="currentColor" strokeWidth="0.5" className="text-zinc-700" />
                    <line x1="0" y1="80" x2="400" y2="80" stroke="currentColor" strokeWidth="0.5" className="text-zinc-700" />
                  </svg>

                  {[35, 42, 38, 55, 60, 48, 62, 70, 75, 82, 80, 85, 90, 88, 92, 95, 98].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col justify-end gap-[2px] relative z-10">
                      <div
                        className="w-full bg-blue-500 rounded-t-[2px] shadow-[0_0_8px_rgba(59,130,246,0.4)]"
                        style={{
                          height: `${h}%`,
                          animation: 'grow 2s ease-in-out infinite alternate',
                          animationDelay: `${i * 50}ms`
                        }}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center bg-zinc-900 rounded-xl p-3 border border-zinc-700 shadow-[0_0_20px_rgba(0,0,0,0.4)]">
                  <div className="space-y-1">
                    <div className="text-[9px] text-zinc-300 uppercase font-black tracking-widest">Ensemble</div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-mono text-zinc-200 font-bold">100 Trees</div>
                    </div>
                  </div>
                  <div className="h-8 w-[1px] bg-zinc-800" />
                  <div className="space-y-1">
                    <div className="text-[9px] text-zinc-300 uppercase font-black tracking-widest">Lag Features</div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-mono text-zinc-200 font-bold">L_1 to L_10</div>
                    </div>
                  </div>
                  <div className="h-8 w-[1px] bg-zinc-800" />
                  <div className="space-y-1">
                    <div className="text-[9px] text-zinc-300 uppercase font-black tracking-widest">Status</div>
                    <div className="rounded-full bg-green-500/20 px-2.5 py-1 border border-green-500/40">
                      <div className="text-[10px] font-mono text-green-400 font-bold animate-pulse">FITTED</div>
                    </div>
                  </div>
                </div>

                <p className="text-[9px] uppercase tracking-[0.25em] text-center text-zinc-400 font-bold pt-2">Scikit-Learn Sub-Process Feed</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
