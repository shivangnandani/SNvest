import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export function Header() {
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const isActive = (path: string) => location.pathname === path

  const navLinks = [
    { path: '/', label: 'Dashboard' },
    { path: '/live-tracking', label: 'Live Day Tracking' },
    { path: '/future-prediction', label: 'Next Day Prediction' },
    { path: '/aboutmodel', label: 'About Model' },
    { path: '/developer', label: 'Developer' },
    { path: '/documentation', label: 'Documentation' }
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 dark:border-white/10 bg-background">
      <div className="w-full max-w-[1600px] mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
        <Link
          to="/"
          className="flex items-center gap-3 transition-opacity hover:opacity-80"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-black/5 dark:border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.05)] backdrop-blur-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-foreground"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/></svg>
          </div>
          <span className="text-xl font-medium tracking-wide text-foreground">SNvest</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-foreground ${isActive(link.path) ? 'text-foreground' : 'text-muted-foreground'}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 text-foreground rounded-md hover:bg-muted/50 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-background border-b border-border shadow-xl py-4 px-6 flex flex-col gap-6 animate-in slide-in-from-top-2">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsMenuOpen(false)}
              className={`text-base font-medium transition-colors hover:text-foreground ${isActive(link.path) ? 'text-foreground' : 'text-muted-foreground'}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
