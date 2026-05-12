'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/index'
import { motion } from 'framer-motion'
import { Loader2, BarChart3, AlertCircle, TrendingUp } from 'lucide-react'

interface SimulationResult {
  final_value: number
  total_return: number
  annual_return: number
  max_drawdown: number
  monthly_performance: number[]
  timestamp: string
}

export default function SimulationPage() {
  const [investment, setInvestment] = useState('100000')
  const [duration, setDuration] = useState('12')
  const [scenario, setScenario] = useState('bull')
  const [allocation, setAllocation] = useState({
    stocks: 60,
    bonds: 30,
    cash: 10,
  })
  const [result, setResult] = useState<SimulationResult | null>(null)
  const [history, setHistory] = useState<SimulationResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Mock simulation logic
  const runSimulation = async () => {
    if (!investment || !duration) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    setError(null)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    try {
      const initialInv = parseFloat(investment)
      const months = parseInt(duration)

      // Generate monthly returns based on scenario
      let baseReturn = 0
      let volatility = 0

      switch (scenario) {
        case 'bull':
          baseReturn = 0.15 // 15% annual return
          volatility = 0.08
          break
        case 'bear':
          baseReturn = -0.05 // -5% annual return
          volatility = 0.12
          break
        case 'sideways':
          baseReturn = 0.03 // 3% annual return
          volatility = 0.05
          break
      }

      const monthlyReturns: number[] = []
      let currentValue = initialInv

      for (let i = 0; i < months; i++) {
        const randomFactor = (Math.random() - 0.5) * 2 * volatility
        const monthlyReturn = baseReturn / 12 + randomFactor
        const monthlyPercentage = monthlyReturn * 100

        monthlyReturns.push(monthlyPercentage)
        currentValue *= 1 + monthlyReturn
      }

      const totalReturn = ((currentValue - initialInv) / initialInv) * 100
      const annualReturn = (Math.pow(currentValue / initialInv, 12 / months) - 1) * 100
      const maxDrawdown = Math.min(...monthlyReturns)

      const simulationResult: SimulationResult = {
        final_value: currentValue,
        total_return: totalReturn,
        annual_return: annualReturn,
        max_drawdown: maxDrawdown,
        monthly_performance: monthlyReturns,
        timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      }

      setResult(simulationResult)
      setHistory([simulationResult, ...history.slice(0, 9)])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Simulation failed')
    } finally {
      setLoading(false)
    }
  }

  const handleAllocationChange = (key: string, value: number) => {
    const newAllocation = { ...allocation, [key]: value }
    const total = Object.values(newAllocation).reduce((a, b) => a + b, 0)

    if (total <= 100) {
      setAllocation(newAllocation)
    }
  }

  const allocationTotal = Object.values(allocation).reduce((a, b) => a + b, 0)

  const getScenarioColor = () => {
    switch (scenario) {
      case 'bull':
        return 'success'
      case 'bear':
        return 'danger'
      case 'sideways':
        return 'warning'
      default:
        return 'default'
    }
  }

  const getReturnColor = (value: number) => {
    if (value >= 0) return 'text-green-400'
    return 'text-red-400'
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2 gradient-gold">Portfolio Simulation</h1>
        <p className="text-gray-400">Model portfolio performance over time under different market conditions</p>
      </div>

      {/* Input Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold">Run Simulation</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Basic Parameters */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Initial Investment (₹)</label>
                  <input
                    type="number"
                    value={investment}
                    onChange={(e) => setInvestment(e.target.value)}
                    placeholder="100000"
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-gold focus:outline-none transition-all"
                    min="1000"
                    step="1000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Duration (months)</label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="12"
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-gold focus:outline-none transition-all"
                    min="1"
                    max="120"
                    step="1"
                  />
                </div>
              </div>

              {/* Market Scenario */}
              <div>
                <label className="block text-sm font-medium mb-2">Market Scenario</label>
                <div className="grid md:grid-cols-3 gap-3">
                  {[
                    { value: 'bull', label: 'Bull Market', desc: '↑ Strong Growth' },
                    { value: 'sideways', label: 'Sideways Market', desc: '→ Stable' },
                    { value: 'bear', label: 'Bear Market', desc: '↓ Decline' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setScenario(opt.value)}
                      className={`p-3 rounded-lg border transition-all text-left ${
                        scenario === opt.value
                          ? 'bg-gold/20 border-gold'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className="font-semibold">{opt.label}</div>
                      <div className="text-xs text-gray-400">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Asset Allocation */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium">Asset Allocation</label>
                  <span className={`text-sm font-semibold ${allocationTotal === 100 ? 'text-green-400' : 'text-yellow-400'}`}>
                    {allocationTotal}%
                  </span>
                </div>
                <div className="space-y-3">
                  {Object.entries(allocation).map(([key, value]) => (
                    <div key={key}>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-sm capitalize">{key}</label>
                        <span className="text-gold font-semibold">{value}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={value}
                        onChange={(e) => handleAllocationChange(key, parseInt(e.target.value))}
                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-gold"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <Button
                onClick={runSimulation}
                disabled={loading || allocationTotal !== 100}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Running Simulation...
                  </>
                ) : (
                  'Run Simulation'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Results */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Key Metrics */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-gray-400 text-sm mb-1">Initial Investment</div>
                <div className="text-2xl font-bold text-gold">₹{parseFloat(investment).toLocaleString('en-IN')}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-gray-400 text-sm mb-1">Final Value</div>
                <div className={`text-2xl font-bold ${getReturnColor(result.final_value - parseFloat(investment))}`}>
                  ₹{result.final_value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-gray-400 text-sm mb-1">Total Return</div>
                <div className={`text-2xl font-bold ${getReturnColor(result.total_return)}`}>
                  {result.total_return > 0 ? '+' : ''}{result.total_return.toFixed(2)}%
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-gray-400 text-sm mb-1">Annualized Return</div>
                <div className={`text-2xl font-bold ${getReturnColor(result.annual_return)}`}>
                  {result.annual_return > 0 ? '+' : ''}{result.annual_return.toFixed(2)}%
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chart Representation */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold">Portfolio Growth</h2>
            </CardHeader>
            <CardContent>
              <div className="h-40 flex items-end justify-between gap-1 px-4 py-4 bg-white/5 rounded-lg">
                {result.monthly_performance.map((perf, idx) => (
                  <div
                    key={idx}
                    className={`flex-1 rounded-t ${perf >= 0 ? 'bg-green-500/60' : 'bg-red-500/60'}`}
                    style={{
                      height: `${Math.min(Math.abs(perf) * 20, 100)}%`,
                      minHeight: perf !== 0 ? '2px' : '1px',
                    }}
                    title={`Month ${idx + 1}: ${perf > 0 ? '+' : ''}${perf.toFixed(2)}%`}
                  />
                ))}
              </div>
              <div className="text-xs text-gray-400 mt-2">Monthly returns over {duration} months</div>
            </CardContent>
          </Card>

          {/* Risk Metrics */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold">Risk Metrics</h2>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="text-gray-400 text-sm mb-2">Maximum Drawdown</div>
                  <div className="text-2xl font-bold text-red-400">{result.max_drawdown.toFixed(2)}%</div>
                  <p className="text-xs text-gray-400 mt-2">Worst single month decline</p>
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-2">Scenario</div>
                  <Badge variant={getScenarioColor()}>
                    {scenario.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Simulation History */}
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">Simulation History</h2>
        </CardHeader>
        <CardContent>
          {history.length > 0 ? (
            <div className="space-y-3">
              {history.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">₹{parseFloat(investment).toLocaleString('en-IN')} → ₹{item.final_value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
                      <div className="text-xs text-gray-400">{item.timestamp}</div>
                    </div>
                    <div className={`font-bold ${getReturnColor(item.total_return)}`}>
                      {item.total_return > 0 ? '+' : ''}{item.total_return.toFixed(2)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No simulations run yet.</p>
              <p className="text-sm mt-2">Create one to see the results!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
