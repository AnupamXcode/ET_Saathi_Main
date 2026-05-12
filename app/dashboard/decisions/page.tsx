'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button.tsx'
import { apiClient } from '@/lib/api-client'
import { DecisionResult } from '@/types'
import { motion } from 'framer-motion'
import { Loader2, Target, AlertCircle } from 'lucide-react'

export default function DecisionsPage() {
  const [symbol, setSymbol] = useState('')
  const [price, setPrice] = useState('')
  const [riskProfile, setRiskProfile] = useState('moderate')
  const [marketConditions, setMarketConditions] = useState('')
  const [decision, setDecision] = useState<DecisionResult | null>(null)

  const [history, setHistory] = useState<
    (DecisionResult & {
      symbol: string
      timestamp: string
    })[]
  >([])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGetDecision = async () => {
    if (!symbol.trim() || !price) {
      setError('Please fill in stock symbol and current price')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await apiClient.post<DecisionResult>(
        '/decisions/analyze',
        {
          stock_symbol: symbol.toUpperCase(),
          current_price: parseFloat(price),
          market_conditions: marketConditions || undefined,
          user_risk_profile: riskProfile,
        }
      )

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Analysis failed')
      }

      const data = response.data

if (!data) {
  throw new Error('No data received')
}

setDecision(data)

setHistory((prev) => [
  {
    recommendation: data.recommendation || 'hold',
    confidence_score: data.confidence_score || 0,
    price_target: data.price_target || 0,
    reasoning: data.reasoning || '',
    risk_level: data.risk_level || 'medium',
    symbol: symbol.toUpperCase(),
    timestamp: new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
    }),
  },
  ...prev,
])

      setSymbol('')
      setPrice('')
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to get decision'
      )
    } finally {
      setLoading(false)
    }
  }

  const getRecommendationVariant = (
    rec: string
  ): 'default' | 'destructive' | 'secondary' | 'outline' => {
    switch (rec.toLowerCase()) {
      case 'sell':
      case 'avoid':
        return 'destructive'

      case 'hold':
        return 'secondary'

      case 'buy':
        return 'default'

      default:
        return 'outline'
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-2 text-4xl font-bold">
          Decision Engine
        </h1>

        <p className="text-gray-400">
          Get personalized Buy/Hold/Sell recommendations
          powered by AI
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold">
              Get Recommendation
            </h2>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Stock Symbol
                  </label>

                  <input
                    type="text"
                    value={symbol}
                    onChange={(e) =>
                      setSymbol(e.target.value)
                    }
                    placeholder="E.g., AAPL, MSFT, TCS"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-white/40 outline-none transition-all focus:border-yellow-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Current Price (₹)
                  </label>

                  <input
                    type="number"
                    value={price}
                    onChange={(e) =>
                      setPrice(e.target.value)
                    }
                    placeholder="0.00"
                    step="0.01"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-white/40 outline-none transition-all focus:border-yellow-500"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Risk Profile
                  </label>

                  <select
                    value={riskProfile}
                    onChange={(e) =>
                      setRiskProfile(e.target.value)
                    }
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white outline-none transition-all focus:border-yellow-500"
                  >
                    <option value="conservative">
                      Conservative
                    </option>

                    <option value="moderate">
                      Moderate
                    </option>

                    <option value="aggressive">
                      Aggressive
                    </option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Market Conditions (Optional)
                  </label>

                  <input
                    type="text"
                    value={marketConditions}
                    onChange={(e) =>
                      setMarketConditions(e.target.value)
                    }
                    placeholder="E.g., volatile, stable"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-white/40 outline-none transition-all focus:border-yellow-500"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-sm text-red-400">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              <Button
                onClick={handleGetDecision}
                disabled={
                  loading ||
                  !symbol.trim() ||
                  !price
                }
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Get Decision'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {decision && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">
                  {decision.recommendation.toUpperCase()}
                </h2>

                <Badge>
  {decision.recommendation.toUpperCase()}
</Badge>
              </div>
            </CardHeader>

            <CardContent>
              <p className="leading-relaxed text-gray-300">
                {decision.reasoning}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">
            Decision History
          </h2>
        </CardHeader>

        <CardContent>
          {history.length > 0 ? (
            <div className="space-y-3">
              {history.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-4"
                >
                  <div>
                    <div className="font-semibold">
                      {item.symbol}
                    </div>

                    <div className="text-xs text-gray-400">
                      {item.timestamp}
                    </div>
                  </div>

                  <Badge>
  variant={getRecommendationVariant(
    item.recommendation
  )}
  </Badge>

                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-gray-400">
              <Target className="mx-auto mb-4 h-12 w-12 opacity-50" />

              <p>No decisions generated yet.</p>

              <p className="mt-2 text-sm">
                Get a recommendation to see results!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}