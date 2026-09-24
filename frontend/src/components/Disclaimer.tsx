import { AlertTriangle, ShieldCheck, Info } from 'lucide-react'

export function Disclaimer() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto py-10 px-4">
      <div className="flex items-center gap-4 mb-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Disclaimer</h1>
          <p className="text-muted-foreground">Important Information Regarding Our Financial Analytics</p>
        </div>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
        <section className="bg-card/50 border border-border p-6 rounded-2xl shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            Not Financial Advice
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            SN provides educational and research-oriented financial analytics tools. 
            The information provided on this website, including but not limited to stock price predictions, market trends, 
            and data analysis, is for <strong>informational purposes only</strong> and does not constitute financial, 
            investment, or professional advice.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Model Accuracy & Risks</h2>
          <p className="text-muted-foreground leading-relaxed">
            Our predictive models use Long Short-Term Memory (LSTM) networks and Deep Learning techniques to analyze 
            historical market data. However, the stock market is influenced by numerous unpredictable factors including 
            geopolitical events, economic shifts, and human behavior. 
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Past performance is not indicative of future results.</li>
            <li>Predictions may deviate significantly from actual market performance.</li>
            <li>The models do not account for real-time news, sudden market shocks, or "black swan" events.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Risk Acknowledgment</h2>
          <p className="text-muted-foreground leading-relaxed">
            By using this application, you acknowledge that trading and investing in financial markets involves 
            substantial risk of loss. You should never invest money that you cannot afford to lose. We strongly 
            recommend consulting with a certified financial advisor before making any investment decisions.
          </p>
        </section>

        <section className="border-t border-border pt-8 mt-12 pb-10 text-sm text-muted-foreground italic">
          Last updated: September 21, 2026
        </section>
      </div>
    </div>
  )
}
