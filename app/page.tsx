'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { TrendingUp, Brain, Zap } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold gradient-gold">ET Saathi</h1>
          <div className="flex gap-4">
            <Link href="/login" className="text-gold hover:text-darkgold transition">Sign In</Link>
            <Link href="/signup" className="btn-primary">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-5xl md:text-7xl font-bold mb-6">
              Your <span className="gradient-gold">Financial AI</span> Analyst
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Transform financial news into actionable decisions. Simulate scenarios. Understand market impacts. Make confident investment choices.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/signup" className="btn-primary">Start Free</Link>
              <Link href="#features" className="btn-secondary">Learn More</Link>
            </div>
          </motion.div>

          {/* Features Preview */}
          <div id="features" className="grid md:grid-cols-3 gap-6 mt-20">
            {[
              {
                icon: Brain,
                title: 'News Analysis',
                description: 'AI-powered extraction of market impact from any financial news'
              },
              {
                icon: TrendingUp,
                title: 'Scenario Simulation',
                description: 'Simulate "what-if" scenarios and model sectoral ripple effects'
              },
              {
                icon: Zap,
                title: 'Decision Engine',
                description: 'Get personalized Buy/Hold/Sell recommendations with confidence scores'
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: i * 0.2 }}
                className="card"
              >
                <feature.icon className="w-12 h-12 text-gold mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
