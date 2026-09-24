import { useState } from 'react'
import { Search } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import { useEffect, useRef } from 'react'

interface StockPredictionFormProps {
  onPredict: (stockName: string, startDate: string) => void
  isLoading: boolean
}

export function StockPredictionForm({ onPredict, isLoading }: StockPredictionFormProps) {
  const [stockName, setStockName] = useState('')
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const suggestionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (stockName.length < 1) {
        setSuggestions([])
        return
      }

      setIsSearching(true)
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
        const response = await fetch(`${baseUrl}/search?q=${stockName}`)
        if (response.ok) {
          const data = await response.json()
          setSuggestions(data)
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error)
      } finally {
        setIsSearching(false)
      }
    }

    const timer = setTimeout(() => {
      fetchSuggestions()
      setSelectedIndex(-1)
    }, 150)

    return () => clearTimeout(timer)
  }, [stockName])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (stockName && startDate) {
      const cleanTicker = stockName.replace(/\s/g, "").toUpperCase()
      onPredict(cleanTicker, startDate)
    }
  }

  const today = new Date().toISOString().split('T')[0]

  const minDate = new Date()
  minDate.setFullYear(minDate.getFullYear() - 5)
  const minDateStr = minDate.toISOString().split('T')[0]

  return (
    <div className="relative z-20">
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <div className="grid gap-6 grid-cols-1">
            <Field>
                <div className="flex justify-between items-baseline">
                  <FieldLabel htmlFor="stock-name">Stock Name or Symbol</FieldLabel>
                  <span className="text-[10px] font-semibold text-primary/80 uppercase tracking-wider">Supports All Indian Markets (.NS, .BO)</span>
                </div>
                <div className="relative">
                  <Input
                    id="stock-name"
                    type="text"
                    placeholder="e.g., Reliance, IOC, TCS"
                    value={stockName}
                    onChange={(e) => {
                      setStockName(e.target.value)
                      setShowSuggestions(true)
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowDown') {
                        e.preventDefault()
                        setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1))
                      } else if (e.key === 'ArrowUp') {
                        e.preventDefault()
                        setSelectedIndex(prev => Math.max(prev - 1, 0))
                      } else if (e.key === 'Enter' && selectedIndex >= 0) {
                        e.preventDefault()
                        const selected = suggestions[selectedIndex]
                        if (selected) {
                          setStockName(selected.symbol)
                          setShowSuggestions(false)
                        }
                      } else if (e.key === 'Escape') {
                        setShowSuggestions(false)
                      }
                    }}
                    required
                    autoComplete="off"
                  />

                  {showSuggestions && (stockName.length > 0 || suggestions.length > 0) && (
                    <div
                      ref={suggestionRef}
                      className="absolute z-50 left-0 right-0 top-full mt-1 rounded-xl border border-border bg-popover p-1 shadow-xl"
                    >
                      {isSearching && suggestions.length === 0 ? (
                        <div className="flex items-center justify-center py-3 text-sm text-muted-foreground">
                          <Spinner className="mr-2 h-3 w-3" /> Searching...
                        </div>
                      ) : suggestions.length > 0 ? (
                        <ul className="max-h-60 overflow-auto">
                          {suggestions.map((s, index) => (
                            <li
                              key={s.symbol}
                              className={`cursor-pointer rounded-lg px-3 py-2.5 text-sm transition-colors ${index === selectedIndex
                                ? 'bg-muted text-foreground'
                                : 'hover:bg-muted/50 text-foreground'
                                }`}
                              onMouseEnter={() => setSelectedIndex(index)}
                              onClick={() => {
                                setStockName(s.symbol)
                                setShowSuggestions(false)
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-semibold">{s.symbol}</span>
                                <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">
                                  {s.exchDisp}
                                </span>
                              </div>
                              <div className="text-xs text-muted-foreground truncate mt-0.5">{s.name}</div>
                            </li>
                          ))}
                        </ul>
                      ) : stockName.length > 0 && !isSearching ? (
                        <div className="px-3 py-3 text-sm text-muted-foreground text-center">
                          No results found
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              </Field>

              <div className="hidden">
                <Field>
                  <FieldLabel htmlFor="start-date">Start Date</FieldLabel>
                  <Input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={minDateStr}
                    max={today}
                    required
                  />
                </Field>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading || !stockName || !startDate}
            >
              {isLoading ? (
                <>
                  <Spinner className="h-4 w-4" />
                  Generating Prediction...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  Generate Prediction
                </>
              )}
            </Button>
          </FieldGroup>
      </form>
    </div>
  )
}
