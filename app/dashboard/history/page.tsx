'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, Target, GitBranch, Calendar } from 'lucide-react'

export default function HistoryPage() {
  // Note: In a production app, this would fetch from a database
  // For now, we show a guide and the history data is managed in each feature page
  const activities = [
    {
      type: 'News Analysis',
      title: 'Sensex Reaches All-Time High',
      sentiment: 'positive',
      date: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      icon: TrendingUp,
    },
    {
      type: 'Decision',
      title: 'RELIANCE - BUY',
      recommendation: 'buy',
      date: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      icon: Target,
    },
    {
      type: 'Scenario',
      title: 'India Budget Impact 2024',
      risk: 'medium',
      date: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      icon: GitBranch,
    },
    {
      type: 'Simulation',
      title: 'Indian Equity Fund Growth',
      return: '+15.2%',
      date: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      icon: BarChart3,
    },
  ]

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'News Analysis':
        return 'from-blue-500 to-cyan-500'
      case 'Decision':
        return 'from-green-500 to-emerald-500'
      case 'Scenario':
        return 'from-purple-500 to-pink-500'
      case 'Simulation':
        return 'from-yellow-500 to-orange-500'
      default:
        return 'from-gray-500 to-gray-600'
    }
  }

  const getMetadataColor = (type: string, value: string) => {
    if (type === 'sentiment') {
      switch (value) {
        case 'positive':
          return 'success'
        case 'negative':
          return 'danger'
        case 'neutral':
          return 'warning'
        default:
          return 'default'
      }
    }
    if (type === 'recommendation') {
      switch (value) {
        case 'buy':
          return 'success'
        case 'sell':
          return 'danger'
        case 'hold':
          return 'warning'
        default:
          return 'default'
      }
    }
    if (type === 'risk') {
      switch (value) {
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
    return 'default'
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2 gradient-gold">Analysis History</h1>
        <p className="text-gray-400">View all your previous analyses and results across all tools</p>
      </div>

      {/* Info Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="border-l-4 border-l-gold">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Calendar className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Track Your Analysis</h3>
                <p className="text-gray-400 text-sm">
                  Each analysis you run is automatically tracked here. Access historical data from News Intelligence, Decision Engine, Scenario Engine, and Portfolio Simulations. The data persists within your current session.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Activity Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold">Recent Activity</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-0 divide-y divide-white/10">
              {activities.map((activity, idx) => {
                const Icon = activity.icon
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="py-4 flex items-start gap-4 hover:bg-white/5 px-4 rounded-lg transition-all"
                  >
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getTypeColor(activity.type)} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-6 h-6" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-gold">{activity.type}</span>
                      </div>
                      <h4 className="font-semibold truncate">{activity.title}</h4>
                      <div className="text-xs text-gray-400 mt-1">{activity.date}</div>
                    </div>

                    {/* Metadata Badge */}
                    <div className="flex-shrink-0">
                      {('sentiment' in activity) && activity.sentiment && (
                        <Badge variant={getMetadataColor('sentiment', activity.sentiment)}>
                          {activity.sentiment.toUpperCase()}
                        </Badge>
                      )}
                      {('recommendation' in activity) && activity.recommendation && (
                        <Badge variant={getMetadataColor('recommendation', activity.recommendation)}>
                          {activity.recommendation.toUpperCase()}
                        </Badge>
                      )}
                      {('risk' in activity) && activity.risk && (
                        <Badge variant={getMetadataColor('risk', activity.risk)}>
                          {activity.risk.toUpperCase()} RISK
                        </Badge>
                      )}
                      {('return' in activity) && activity.return && (
                        <Badge variant={activity.return.includes('+') ? 'success' : 'danger'}>
                          {activity.return}
                        </Badge>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Feature Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                News Intelligence
              </h3>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm mb-3">
                All your financial news analyses with sentiment, affected sectors, and market impact assessments.
              </p>
              <p className="text-gold font-semibold">View in News Intelligence tab</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Target className="w-5 h-5 text-green-400" />
                Decision Engine
              </h3>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm mb-3">
                Buy/Hold/Sell recommendations for stocks with confidence scores and price targets.
              </p>
              <p className="text-gold font-semibold">View in Decision Engine tab</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-purple-400" />
                Scenario Engine
              </h3>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm mb-3">
                Market scenario simulations showing sector impacts and portfolio effects.
              </p>
              <p className="text-gold font-semibold">View in Scenario Engine tab</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-orange-400" />
                Portfolio Simulation
              </h3>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm mb-3">
                Portfolio performance projections across bull, bear, and sideways market conditions.
              </p>
              <p className="text-gold font-semibold">View in Simulation tab</p>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold">This Session</h2>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="text-gray-400 text-sm mb-2">News Analyses</div>
                <div className="text-3xl font-bold text-gold">0</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="text-gray-400 text-sm mb-2">Decisions Made</div>
                <div className="text-3xl font-bold text-gold">0</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="text-gray-400 text-sm mb-2">Scenarios Run</div>
                <div className="text-3xl font-bold text-gold">0</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="text-gray-400 text-sm mb-2">Simulations</div>
                <div className="text-3xl font-bold text-gold">0</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm mt-4">
              Counters will update as you use the various analysis tools. All session data is stored locally.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
