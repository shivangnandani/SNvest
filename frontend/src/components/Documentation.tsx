import { Terminal, BookOpen, Code, Server, Globe, AlertTriangle, Cpu, Database, CpuIcon, Layers, Search, BarChart3, Clock, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function Documentation() {
  return (
    <div className="relative mx-auto max-w-5xl space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24 px-4 overflow-hidden">

      <div className="absolute top-0 -left-20 h-96 w-96 rounded-full bg-primary/5 blur-[120px] -z-10" />
      <div className="absolute bottom-40 -right-20 h-96 w-96 rounded-full bg-blue-500/5 blur-[120px] -z-10" />

      <section className="text-center pt-8">
        <h2 className="text-4xl font-extrabold tracking-tight text-foreground md:text-5xl lg:text-6xl text-balance">
          Documentation
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground text-balance leading-relaxed">
          Everything you need to know about SNvest, from usage guides to system architecture and API specifications.
        </p>
      </section>

      <div className="grid gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-12">
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight">User Guide</h3>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {[
                {
                  icon: Search,
                  title: "Step 1: Search",
                  desc: "Start by typing a company name. Our real-time search exclusively supports and filters all stocks spanning the Indian Markets (NSE and BSE)."
                },
                {
                  icon: Clock,
                  title: "Step 2: Timeframe",
                  desc: "Select a start date for the analysis. The model uses this window to recognize patterns and trends."
                },
                {
                  icon: CpuIcon,
                  title: "Step 3: Process",
                  desc: "Click 'Generate Prediction'. Our dual-engine Random Forest models fetch and process your data instantaneously."
                },
                {
                  icon: BarChart3,
                  title: "Step 4: Analyze",
                  desc: "Visualize the forecast against historical data to identify potential market directions."
                }
              ].map((step, i) => (
                <Card key={i} className="border-border/40 bg-card/40 backdrop-blur-md transition-all hover:bg-card/60 hover:shadow-lg hover:border-primary/20">
                  <CardHeader className="pb-2">
                    <step.icon className="h-5 w-5 text-primary mb-2" />
                    <CardTitle className="text-base">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                <Terminal className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight">API Reference</h3>
            </div>

            <div className="space-y-6">
              <Card className="border-border/40 bg-zinc-950 text-zinc-100 overflow-hidden">
                <div className="border-b border-zinc-800 bg-zinc-900/50 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-emerald-500 text-white border-0">POST</Badge>
                    <code className="text-sm font-mono text-zinc-300">/predict</code>
                  </div>
                </div>
                <CardContent className="p-0">
                  <div className="p-4">
                    <p className="text-sm text-zinc-400 mb-4">Initializes model inference for specific stock tickers.</p>
                    <div className="rounded-lg bg-black/50 p-4 font-mono text-xs">

                      <pre className="text-emerald-400">
                        {`{
  "ticker": "RELIANCE",
  "start_date": "2023-01-01"
}`}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/40 bg-zinc-950 text-zinc-100 overflow-hidden">
                <div className="border-b border-zinc-800 bg-zinc-900/50 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-emerald-500 text-white border-0">POST</Badge>
                    <code className="text-sm font-mono text-zinc-300">/predict-daily</code>
                  </div>
                </div>
                <CardContent className="p-0">
                  <div className="p-4">
                    <p className="text-sm text-zinc-400 mb-4">Initializes recursive 7-day multi-step forecasting.</p>
                    <div className="rounded-lg bg-black/50 p-4 font-mono text-xs">
                      <pre className="text-emerald-400">
                        {`{
  "ticker": "RELIANCE.NS"
}`}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border/40 bg-zinc-950 text-zinc-100 overflow-hidden">
                <div className="border-b border-zinc-800 bg-zinc-900/50 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-blue-500 text-white border-0">GET</Badge>
                    <code className="text-sm font-mono text-zinc-300">/search</code>
                  </div>
                </div>
                <CardContent className="p-4">
                  <p className="text-sm text-zinc-400 mb-2">Fetches ticker suggestions based on query string.</p>
                  <code className="text-xs text-blue-400 font-mono">?q=apple</code>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>

        <div className="space-y-12">
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight">Technology</h3>
            </div>

            <Card className="border-border/40 bg-card/40 backdrop-blur-md">
              <CardContent className="pt-6 space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Server className="h-4 w-4 text-primary" />
                    <span className="text-sm font-bold">Inference Engine</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['FastAPI', 'PyTorch', 'NumPy', 'Pandas'].map(tag => (
                      <Badge key={tag} variant="secondary" className="text-[10px] font-medium opacity-80">{tag}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="h-4 w-4 text-primary" />
                    <span className="text-sm font-bold">Frontend Interface</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['React', 'Tailwind', 'Shadcn UI', 'Vite'].map(tag => (
                      <Badge key={tag} variant="secondary" className="text-[10px] font-medium opacity-80">{tag}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="h-4 w-4 text-primary" />
                    <span className="text-sm font-bold">Data Sources</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Yahoo Finance API via the <code className="text-primary">yfinance</code> library provides real-time and historical OHLCV data.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="space-y-4">
            <h4 className="text-lg font-bold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Disclaimer
            </h4>
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
              <p className="text-xs text-amber-800/80 dark:text-amber-400/80 leading-relaxed italic">
                "Predictions are for educational purposes. We do not guarantee accuracy. Stock market investments involve risk. Please consult a financial advisor before making decisions."
              </p>
            </div>
          </section>

          <Card className="border-border/60 bg-card/50">
            <CardContent className="p-6 text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <h4 className="font-semibold mb-1">Ready to Predict?</h4>
              <p className="text-xs text-muted-foreground px-4">
                Head back to the dashboard to start analyzing your favorite stocks.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
