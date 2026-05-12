'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { TrendingUp, Target, GitBranch, BarChart3 } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const quickActions = [
    {
      title: 'News Intelligence',
      description: 'Analyze financial news for market impact and sentiment',
      icon: TrendingUp,
      href: '/dashboard/news',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Scenario Engine',
      description: 'Simulate "what-if" market scenarios',
      icon: GitBranch,
      href: '/dashboard/scenarios',
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Decision Engine',
      description: 'Get personalized Buy/Hold/Sell recommendations',
      icon: Target,
      href: '/dashboard/decisions',
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Simulation',
      description: 'Model portfolio performance over time',
      icon: BarChart3,
      href: '/dashboard/simulation',
      color: 'from-yellow-500 to-orange-500',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-4xl font-bold mb-2 gradient-gold">Welcome Back</h1>
        <p className="text-gray-400">Your financial intelligence engine is ready to help you make smarter decisions</p>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {quickActions.map((action, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <Link href={action.href}>
              <Card className="card-hover cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold mb-1">{action.title}</h3>
                      <p className="text-sm text-gray-400">{action.description}</p>
                    </div>
                    <action.icon className="w-6 h-6 text-gold" />
                  </div>
                </CardHeader>
                <CardContent>
                  <Badge>Explore</Badge>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">Recent Activity</h2>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-400">
            <p>No recent activity yet.</p>
            <p className="text-sm mt-2">Start by exploring one of the tools above</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
