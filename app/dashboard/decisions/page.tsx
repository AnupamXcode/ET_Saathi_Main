'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/index'
import { apiClient } from '@/lib/api-client'
import { DecisionResult } from '@/types'
import { motion } from 'framer-motion'
import { Loader2, TrendingUp, Target, AlertCircle } from 'lucide-react'

export default function DecisionsPage() {
  const [symbol, setSymbol] = useState('')
  const [price, setPrice] = useState('')
  const [riskProfile, setRiskProfile] = useState('moderate')
  const [marketConditions, setMarketConditions] = useState('')
  const [decision, setDecision] = useState<DecisionResult | null>(null)
  const [history, setHistory] = useState<(DecisionResult & { symbol: string; timestamp: string })[]>([])
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
      const response = await apiClient.post<DecisionResult>('/decisions/analyze', {
        stock_symbol: symbol.toUpperCase(),
        current_price: parseFloat(price),
        market_conditions: marketConditions || undefined,
        user_risk_profile: riskProfile,
      })

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Analysis failed')
      }

      setDecision(response.data)
      setHistory([
        {
          ...response.data,
          symbol: symbol.toUpperCase(),
          timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        },
        ...history,
      ])
      setSymbol('')
      setPrice('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get decision')
    } finally {
      setLoading(false)
    }
  }

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'buy':
        return 'success'
      case 'sell':
        return 'danger'
      case 'hold':
        return 'warning'
      case 'avoid':
        return 'danger'
      default:
        return 'default'
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'success'
      case 'medium':
        return 'warning'
      case 'high':
        return 'danger'
      default:
        return 'default'
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2 gradient-gold">Decision Engine</h1>
        <p className="text-gray-400">Get personalized Buy/Hold/Sell recommendations powered by AI</p>
      </div>

      {/* Input Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold">Get Recommendation</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Stock Symbol</label>
                  <input
                    type="text"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    placeholder="E.g., AAPL, MSFT, TCS"
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-gold focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Current Price (₹)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-gold focus:outline-none transition-all"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Risk Profile</label>
                  <select
                    value={riskProfile}
                    onChange={(e) => setRiskProfile(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-gold focus:outline-none transition-all"
                  >
                    <option value="conservative">Conservative</option>
                    <option value="moderate">Moderate</option>
                    <option value="aggressive">Aggressive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Market Conditions (Optional)</label>
                  <input
                    type="text"
                    value={marketConditions}
                    onChange={(e) => setMarketConditions(e.target.value)}
                    placeholder="E.g., volatile, stable"
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-gold focus:outline-none transition-all"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <Button
                onClick={handleGetDecision}
                disabled={loading || !symbol.trim() || !price}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
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

      {/* Current Decision */}
      {decision && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">{symbol} - Recommendation</h2>
                <Badge variant={getRecommendationColor(decision.recommendation)}>
                  {decision.recommendation.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="text-gray-400 text-sm mb-1">Price Target</div>
                  <div className="text-2xl font-bold text-gold">₹{decision.price_target.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="text-gray-400 text-sm mb-1">Confidence</div>
                  <div className="text-2xl font-bold text-gold">{(decision.confidence_score * 100).toFixed(0)}%</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="text-gray-400 text-sm mb-1">Risk Level</div>
                  <Badge variant={getRiskColor(decision.risk_level)}>
                    {decision.risk_level.toUpperCase()}
                  </Badge>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed">{decision.reasoning}</p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Decision History */}
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">Decision History</h2>
        </CardHeader>
        <CardContent>
          {history.length > 0 ? (
            <div className="space-y-3">
              {history.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="font-semibold">{item.symbol}</div>
                      <div className="text-xs text-gray-400">{item.timestamp}</div>
                    </div>
                  </div>
                  <Badge variant={getRecommendationColor(item.recommendation)}>
                    {item.recommendation.toUpperCase()}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No decisions generated yet.</p>
              <p className="text-sm mt-2">Get a recommendation to see results!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
