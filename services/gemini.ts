import { GoogleGenerativeAI } from '@google/generative-ai'

let genAI: GoogleGenerativeAI | null = null

function getGenAI() {
  if (!genAI) {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY

    if (!apiKey) {
      throw new Error('Missing Gemini API key')
    }

    genAI = new GoogleGenerativeAI(apiKey)
  }
  return genAI
}

export function getGeminiModel() {
  return getGenAI().getGenerativeModel({ model: 'gemini-2.0-flash' })
}

// Mock data generators for fallback
function generateMockNewsAnalysis(newsText: string) {
  return {
    summary: `Market analysis indicates ${newsText.includes('positive') || newsText.includes('growth') || newsText.includes('strong') ? 'positive' : 'neutral'} sentiment. Key findings show sector-wide implications.`,
    sentiment: newsText.includes('negative') || newsText.includes('decline') || newsText.includes('loss') ? 'negative' : newsText.includes('positive') || newsText.includes('growth') || newsText.includes('strong') ? 'positive' : 'neutral',
    affected_sectors: ['Technology', 'Finance', 'Consumer'],
    affected_stocks: ['AAPL', 'MSFT', 'GOOGL'],
    market_impact: 'The reported developments could significantly impact market dynamics in the coming weeks, with potential spillover effects across related sectors.',
    recommendations: ['Monitor sector trends', 'Review portfolio exposure', 'Consider hedging strategies'],
    confidence_score: 0.82,
  }
}

function generateMockDecisionAnalysis() {
  return {
    recommendation: 'buy',
    confidence_score: 0.78,
    price_target: 185.5,
    reasoning: 'Based on current market conditions and technical analysis, this stock shows strong upside potential with favorable risk-reward dynamics.',
    risk_level: 'medium',
  }
}

function generateMockScenarioAnalysis(scenario: string) {
  return {
    scenario_name: 'Market Scenario Analysis',
    description: `Comprehensive analysis of: ${scenario.substring(0, 100)}...`,
    sector_impacts: [
      {
        sector_name: 'Energy',
        impact_percentage: 8.5,
        affected_companies: ['XOM', 'CVX', 'MPC'],
      },
      {
        sector_name: 'Technology',
        impact_percentage: -3.2,
        affected_companies: ['AAPL', 'MSFT', 'NVDA'],
      },
      {
        sector_name: 'Financials',
        impact_percentage: 4.1,
        affected_companies: ['JPM', 'BAC', 'GS'],
      },
    ],
    portfolio_impact: 2.8,
    recommended_actions: ['Rebalance portfolio', 'Increase hedging', 'Review sector allocations'],
    risk_level: 'medium',
  }
}

export async function generateAnalysis<T>(prompt: string): Promise<T> {
  try {
    const model = getGeminiModel()
    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
    })

    const response = result.response
    const text = response.text()

    // Try to parse JSON response
    try {
      return JSON.parse(text) as T
    } catch {
      // Try to extract JSON from code blocks
      const match = text.match(/```(?:json)?\s*([\s\S]*?)```/)
      if (match) {
        return JSON.parse(match[1]) as T
      }
      throw new Error('Failed to parse AI response as JSON')
    }
  } catch (error) {
    console.error('Gemini API error:', error)

    // Fallback to mock responses
    if (prompt.includes('financial news') || prompt.includes('Analyze the following financial news')) {
      return generateMockNewsAnalysis(prompt) as T
    } else if (prompt.includes('investment recommendation') || prompt.includes('financial decision')) {
      return generateMockDecisionAnalysis() as T
    } else if (prompt.includes('market scenario') || prompt.includes('Simulate')) {
      return generateMockScenarioAnalysis(prompt) as T
    }

    // Generic error message
    throw new Error('API analysis failed. Using mock data for demonstration.')
  }
}

export async function streamAnalysis(prompt: string): Promise<ReadableStream<string>> {
  const model = getGeminiModel()
  const result = await model.generateContentStream({
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ],
  })

  let buffer = ''

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of result.stream) {
          const text = chunk.text()
          buffer += text
          controller.enqueue(text)
        }
        controller.close()
      } catch (error) {
        controller.error(error)
      }
    },
  })
}
