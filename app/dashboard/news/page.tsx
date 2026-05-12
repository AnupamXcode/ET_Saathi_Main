'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/index'
import { apiClient } from '@/lib/api-client'
import { NewsAnalysisResult } from '@/types'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

export default function NewsPage() {
  const [newsText, setNewsText] = useState('')
  const [analysis, setAnalysis] = useState<NewsAnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async () => {
    if (!newsText.trim()) {
      setError('Please enter some financial news')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await apiClient.post<NewsAnalysisResult>('/news/analyze', {
        news_text: newsText,
      })

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Analysis failed')
      }

      setAnalysis(response.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze news')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2 gradient-gold">News Intelligence</h1>
        <p className="text-gray-400">Analyze financial news and understand market impact</p>
      </div>

      {/* Input Section */}
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">Analyze News</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Financial News or Press Release</label>
              <textarea
                value={newsText}
                onChange={(e) => setNewsText(e.target.value)}
                placeholder="Paste financial news, press release, or market update here..."
                className="w-full h-40 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-gold focus:outline-none transition-all resize-none"
              />
            </div>

            {error && <div className="text-red-400 text-sm">{error}</div>}

            <Button
              onClick={handleAnalyze}
              disabled={loading || !newsText.trim()}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Analyze News'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Summary */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <span>Summary</span>
                <Badge
                  variant={
                    analysis.sentiment === 'positive'
                      ? 'success'
                      : analysis.sentiment === 'negative'
                      ? 'danger'
                      : 'warning'
                  }
                >
                  {analysis.sentiment.toUpperCase()}
                </Badge>
              </h2>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed">{analysis.summary}</p>
              <div className="mt-4 flex items-center gap-4">
                <span className="text-gray-400">Confidence:</span>
                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-gold to-darkgold"
                    style={{ width: `${analysis.confidence_score * 100}%` }}
                  />
                </div>
                <span className="text-gold font-semibold">{(analysis.confidence_score * 100).toFixed(0)}%</span>
              </div>
            </CardContent>
          </Card>

          {/* Market Impact */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold">Market Impact</h2>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 leading-relaxed">{analysis.market_impact}</p>
            </CardContent>
          </Card>

          {/* Affected Sectors */}
          {analysis.affected_sectors.length > 0 && (
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">Affected Sectors</h2>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {analysis.affected_sectors.map((sector, i) => (
                    <Badge key={i} variant="warning">
                      {sector}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Affected Stocks */}
          {analysis.affected_stocks.length > 0 && (
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">Affected Stocks</h2>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {analysis.affected_stocks.map((stock, i) => (
                    <div key={i} className="p-3 bg-white/5 rounded-lg border border-white/10 text-center font-mono font-semibold">
                      {stock}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recommendations */}
          {analysis.recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">Recommendations</h2>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-gold mt-1">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </motion.div>
      )}
    </div>
  )
}
