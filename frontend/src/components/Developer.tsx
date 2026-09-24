import { Card, CardContent } from "@/components/ui/card"
import { ExternalLink, Github, Linkedin, Mail } from "lucide-react"
import developerImage from "../assets/developer.png"

export function Developer() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-5xl mx-auto space-y-12 px-4 sm:px-6 pb-20">
      <div className="text-center space-y-4 pt-8">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground uppercase">
          About the Developer
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          The vision and architecture behind the SNvest prediction engine.
        </p>
      </div>

      <Card className="border-border shadow-xl bg-card overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 bg-muted/20 p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-border/50">
            <div className="relative w-48 h-48 mb-6 mt-2 cursor-default">
              {/* Subtle ambient glow */}
              <div className="absolute -inset-2 rounded-full bg-primary/20 blur-xl animate-pulse" style={{ animationDuration: '4s' }}></div>
              
              {/* Image Container */}
              <div className="relative w-full h-full rounded-full overflow-hidden border-[4px] border-background shadow-sm bg-white dark:bg-white/90 flex items-center justify-center z-10">
                <img 
                  src={developerImage}
                  alt="Shivang Nandani" 
                  className="w-full h-full object-cover scale-[1.15] translate-y-3"
                />
              </div>
            </div>
            <h2 className="text-2xl font-bold tracking-tight mb-2">Shivang Nandani</h2>
            <p className="text-primary font-medium mb-6 text-center text-sm uppercase tracking-wider">Computer Engineering Student</p>
            
            <div className="flex gap-4">
              <a href="https://in.linkedin.com/in/shivangnandani" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-background border border-border hover:border-primary hover:text-primary transition-all shadow-sm">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="mailto:shivangnandani@gmail.com" className="p-2 rounded-full bg-background border border-border hover:border-primary hover:text-primary transition-all shadow-sm">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div className="md:w-2/3 p-8 md:p-10 flex flex-col justify-center">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-8 h-1 bg-primary rounded-full"></span>
              About Me
            </h3>
            <p className="text-muted-foreground leading-relaxed text-lg">
              Shivang Nandani is a computer engineering student with an interest in development, UI/UX, entrepreneurship, and emerging technology. His work combines technical experimentation with practical problem-solving, building projects that explore how technology can be applied to real-world challenges.
            </p>
            
            <div className="mt-8 pt-8 border-t border-border/50">
              <h3 className="text-sm font-bold uppercase tracking-widest text-foreground/80 mb-4">Technical Stack</h3>
              <div className="flex flex-wrap gap-2">
                {['Python', 'Pandas', 'NumPy', 'Scikit-learn', 'Matplotlib', 'Machine Learning', 'Time-Series Analysis', 'Data Visualization', 'React', 'Tailwind'].map(tech => (
                  <span key={tech} className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full border border-primary/20">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="border-border bg-card">
          <CardContent className="p-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
              Project Ideation
            </h3>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                The idea behind this project was to explore whether Machine Learning could identify patterns in historical Indian stock-market data and use those patterns to estimate short-term market trends.
              </p>
              <p>
                Instead of building the project around a simple "tomorrow's price" prediction, I approached it as a time-series forecasting and trend-analysis problem. The system works around two perspectives:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm mt-4">
                <li><strong className="text-foreground">Past 7-Day Analysis:</strong> Compare the model's predicted trend against the actual market movement from the previous seven trading days.</li>
                <li><strong className="text-foreground">Future 7-Day Forecast:</strong> Use historical price behaviour and engineered market features to estimate the expected trend for the upcoming seven trading days.</li>
                <li><strong className="text-foreground">Pattern-Based Learning:</strong> Train the model on historical market behaviour rather than manually defining whether a stock should move up or down.</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
              Key Learnings
            </h3>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                The biggest takeaway from this project was that financial prediction is fundamentally different from predicting a clean, deterministic dataset. Markets contain noise, changing patterns, and external influences that historical price data alone cannot fully capture.
              </p>
              <p>
                Building this project helped me understand the complete ML workflow:
              </p>
              <div className="bg-muted/50 p-4 rounded-xl text-xs sm:text-sm font-mono font-medium text-foreground text-center my-4 border border-border/50">
                Raw Data → Cleaning → Feature Engineering → Training → Prediction → Backtesting → Visualization
              </div>
              <p className="italic border-l-4 border-primary/50 pl-4 py-1 text-foreground/90">
                "Can I build a system that learns from the past, makes a measurable prediction, and honestly shows me where it was right or wrong?"
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card">
        <CardContent className="p-8 md:p-10">
          <h3 className="text-2xl font-bold mb-8 text-center uppercase tracking-tight">Development Approach</h3>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Data Collection", desc: "Historical OHLCV data forms the foundation of the dataset. The raw time-series data is cleaned, organized chronologically, and prepared for model training." },
              { title: "Feature Engineering", desc: "Derives meaningful features from historical observations like price movements, trends and rolling-window behaviour to learn relationships across multiple time periods." },
              { title: "Dataset Construction", desc: "Data is transformed into sequential training samples, where previous market observations become inputs and subsequent movements become the target." },
              { title: "Machine Learning", desc: "A supervised ML Random Forest approach is used to learn patterns from historical observations to generate robust predictions." },
              { title: "Prediction vs. Reality", desc: "Visualizes what the model predicted vs what actually happened to identify prediction errors and capture difficult market movements." },
              { title: "Visualization & Analysis", desc: "Focuses on making the model understandable through charts and trend comparisons rather than treating the ML model as a black box." }
            ].map((step, i) => (
              <div key={i} className="bg-muted/30 p-6 rounded-2xl border border-border/50 relative overflow-hidden group hover:bg-muted/50 transition-colors">
                <div className="text-5xl font-black text-foreground/5 absolute -top-2 -right-2 group-hover:text-primary/10 transition-colors">0{i+1}</div>
                <h4 className="font-bold text-foreground mb-3 relative z-10">{step.title}</h4>
                <p className="text-sm text-muted-foreground relative z-10 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
