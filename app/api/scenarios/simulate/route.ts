import { NextRequest, NextResponse } from 'next/server'
import { generateAnalysis } from '@/services/gemini'
import { ScenarioResult } from '@/types'
import { z } from 'zod'

const scenarioSchema = z.object({
  scenario_description: z.string().min(10),
  user_portfolio: z.array(z.any()).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { scenario_description, user_portfolio } = scenarioSchema.parse(body)

    const portfolioContext = user_portfolio
      ? `User Portfolio: ${JSON.stringify(user_portfolio)}`
      : ''

    const prompt = `You are a financial scenario analyst. Simulate the following market scenario and provide structured JSON analysis:

Scenario: ${scenario_description}

${portfolioContext}

Analyze the scenario and return JSON with these exact fields:
{
  "scenario_name": "Scenario name",
  "description": "Detailed description of the scenario",
  "sector_impacts": [
    {
      "sector_name": "Sector Name",
      "impact_percentage": 5.5,
      "affected_companies": ["Company1", "Company2"]
    }
  ],
  "portfolio_impact": 2.3,
  "recommended_actions": ["action1", "action2"],
  "risk_level": "low" | "medium" | "high"
}

Return ONLY valid JSON, no additional text.`

    const result = await generateAnalysis<ScenarioResult>(prompt)

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('Scenario analysis error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Scenario analysis failed',
      },
      { status: 400 }
    )
  }
}
