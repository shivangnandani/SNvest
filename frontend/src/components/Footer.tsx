import { Github, Linkedin, Mail, TrendingUp, Twitter, ExternalLink, MessageSquare } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-black/5 dark:border-white/5 bg-white/40 dark:bg-black/20 backdrop-blur-xl pt-16 pb-12 overflow-hidden mt-20">

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />

      <div className="w-full max-w-[1600px] mx-auto px-4 lg:px-8 relative z-0">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-6 group cursor-default">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-black/5 dark:border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.05)] backdrop-blur-md transition-transform group-hover:scale-105">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-foreground"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/></svg>
              </div>
              <span className="text-2xl font-medium tracking-wide text-foreground">
                SNvest
              </span>
            </div>
            <p className="max-w-sm text-base leading-relaxed text-muted-foreground/80">
              <span className="font-bold text-foreground block">SN</span>
              AI-powered financial analytics and predictive market technologies.
            </p>

            <div className="mt-8 flex items-center gap-4">
              <a
                href="https://in.linkedin.com/in/shivangnandani"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/50 text-muted-foreground transition-all hover:border-primary hover:text-primary hover:shadow-[0_0_10px_rgba(var(--primary),0.2)]"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a
                href="mailto:shivangnandani@gmail.com"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/50 text-muted-foreground transition-all hover:border-primary hover:text-primary hover:shadow-[0_0_10px_rgba(var(--primary),0.2)]"
              >
                <Mail className="h-5 w-5" />
                <span className="sr-only">Mail</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8 items-start align-top">
            <div className="flex flex-col items-start justify-start">
              <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-foreground/90 leading-none">Quick Links</h3>
              <ul className="space-y-4">
                <li>
                  <a href="https://finance.yahoo.com" target="_blank" rel="noopener noreferrer" className="group flex items-center text-sm text-muted-foreground transition-colors hover:text-primary">
                    <span className="relative">
                      Yahoo Finance
                      <span className="absolute -bottom-1 left-0 h-px w-0 bg-primary transition-all group-hover:w-full" />
                    </span>
                    <ExternalLink className="ml-1.5 h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                  </a>
                </li>
                <li>
                  <a href="https://www.tradingview.com" target="_blank" rel="noopener noreferrer" className="group flex items-center text-sm text-muted-foreground transition-colors hover:text-primary">
                    <span className="relative">
                      TradingView
                      <span className="absolute -bottom-1 left-0 h-px w-0 bg-primary transition-all group-hover:w-full" />
                    </span>
                    <ExternalLink className="ml-1.5 h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                  </a>
                </li>
                <li>
                  <a href="https://www.screener.in" target="_blank" rel="noopener noreferrer" className="group flex items-center text-sm text-muted-foreground transition-colors hover:text-primary">
                    <span className="relative">
                      Screener
                      <span className="absolute -bottom-1 left-0 h-px w-0 bg-primary transition-all group-hover:w-full" />
                    </span>
                    <ExternalLink className="ml-1.5 h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                  </a>
                </li>
              </ul>
            </div>

            <div className="flex flex-col items-start justify-start">
              <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-foreground/90 leading-none">How it works</h3>
              <ul className="space-y-4">
                <li>
                  <Link to="/aboutmodel" className="group flex items-center text-sm text-muted-foreground transition-colors hover:text-primary">
                    <span className="relative">
                      About Model
                      <span className="absolute -bottom-1 left-0 h-px w-0 bg-primary transition-all group-hover:w-full" />
                    </span>
                  </Link>
                </li>
                <li>
                  <Link to="/documentation" className="group flex items-center text-sm text-muted-foreground transition-colors hover:text-primary">
                    <span className="relative">
                      Documentation
                      <span className="absolute -bottom-1 left-0 h-px w-0 bg-primary transition-all group-hover:w-full" />
                    </span>
                  </Link>
                </li>
                <li>
                  <Link to="/developer" className="group flex items-center text-sm text-muted-foreground transition-colors hover:text-primary">
                    <span className="relative">
                      Developer
                      <span className="absolute -bottom-1 left-0 h-px w-0 bg-primary transition-all group-hover:w-full" />
                    </span>
                  </Link>
                </li>
              </ul>
            </div>

            <div className="flex flex-col items-start justify-start">
              <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-foreground/90 leading-none">Legal</h3>
              <ul className="space-y-4">
                <li>
                  <Link to="/disclaimer" className="group flex items-center text-sm text-muted-foreground transition-colors hover:text-primary">
                    <span className="relative">
                      Disclaimer
                      <span className="absolute -bottom-1 left-0 h-px w-0 bg-primary transition-all group-hover:w-full" />
                    </span>
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="group flex items-center text-sm text-muted-foreground transition-colors hover:text-primary">
                    <span className="relative">
                      Terms of Service
                      <span className="absolute -bottom-1 left-0 h-px w-0 bg-primary transition-all group-hover:w-full" />
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between border-t border-border/50 pt-8 gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground/60 text-center md:text-left">
            © {currentYear} SNvest. Built with React & Deep Learning.
            <span className="block md:inline md:ml-2 text-primary/60 font-medium">Educational Research Project.</span>
          </p>

          <div className="flex items-center gap-1 text-sm text-muted-foreground/60">
            <span className="font-semibold text-foreground/80">SNvest</span>
            <span>- See Tomorrow. Trade Today.</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
