'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/index'
import { apiClient } from '@/lib/api-client'
import { ScenarioResult } from '@/types'
import { motion } from 'framer-motion'
import { Loader2, GitBranch, AlertCircle } from 'lucide-react'

export default function ScenariosPage() {
  const [description, setDescription] = useState('')
  const [scenario, setScenario] = useState<ScenarioResult | null>(null)
  const [history, setHistory] = useState<(ScenarioResult & { timestamp: string })[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSimulate = async () => {
    if (!description.trim()) {
      setError('Please enter a scenario description')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await apiClient.post<ScenarioResult>('/scenarios/simulate', {
        scenario_description: description,
      })

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Simulation failed')
      }

      setScenario(response.data)
      setHistory([
        {
          ...response.data,
          timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        },
        ...history,
      ])
      setDescription('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to simulate scenario')
    } finally {
      setLoading(false)
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

  const getImpactColor = (impact: number) => {
    if (impact > 0) return 'text-green-400'
    if (impact < 0) return 'text-red-400'
    return 'text-gray-400'
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2 gradient-gold">Scenario Engine</h1>
        <p className="text-gray-400">Simulate "what-if" market scenarios and model sectoral ripple effects</p>
      </div>

      {/* Input Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold">Create New Scenario</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Scenario Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="E.g., What if crude oil prices rise by 20%? What would be the impact on energy stocks, inflation, and transportation sector?"
                  className="w-full h-40 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-gold focus:outline-none transition-all resize-none"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <Button
                onClick={handleSimulate}
                disabled={loading || !description.trim()}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Simulating...
                  </>
                ) : (
                  'Simulate Scenario'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Scenario Results */}
      {scenario && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold">{scenario.scenario_name}</h2>
                  <p className="text-gray-400 mt-2">{scenario.description}</p>
                </div>
                <Badge variant={getRiskColor(scenario.risk_level)}>
                  {scenario.risk_level.toUpperCase()} RISK
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="text-gray-400 text-sm mb-1">Portfolio Impact</div>
                  <div className={`text-2xl font-bold ${getImpactColor(scenario.portfolio_impact)}`}>
                    {scenario.portfolio_impact > 0 ? '+' : ''}{scenario.portfolio_impact.toFixed(2)}%
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="text-gray-400 text-sm mb-1">Affected Sectors</div>
                  <div className="text-2xl font-bold">{scenario.sector_impacts.length}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sector Impacts */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold">Sector-by-Sector Impact</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scenario.sector_impacts.map((sector, idx) => (
                  <div
                    key={idx}
                    className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">{sector.sector_name}</h3>
                      <span className={`text-lg font-bold ${getImpactColor(sector.impact_percentage)}`}>
                        {sector.impact_percentage > 0 ? '+' : ''}{sector.impact_percentage.toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {sector.affected_companies.map((company, i) => (
                        <Badge key={i} variant="default">
                          {company}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommended Actions */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold">Recommended Actions</h2>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {scenario.recommended_actions.map((action, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-gray-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Scenario History */}
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">Previous Scenarios</h2>
        </CardHeader>
        <CardContent>
          {history.length > 0 ? (
            <div className="space-y-3">
              {history.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold">{item.scenario_name}</div>
                    <div className="flex items-center gap-3">
                      <span className={`font-bold ${getImpactColor(item.portfolio_impact)}`}>
                        {item.portfolio_impact > 0 ? '+' : ''}{item.portfolio_impact.toFixed(2)}%
                      </span>
                      <Badge variant={getRiskColor(item.risk_level)}>
                        {item.risk_level.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">{item.timestamp}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <GitBranch className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No scenarios created yet.</p>
              <p className="text-sm mt-2">Create one to get started!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
