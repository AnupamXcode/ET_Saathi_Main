import { NextRequest, NextResponse } from 'next/server'
import { generateAnalysis } from '@/services/gemini'
import { DecisionResult } from '@/types'
import { z } from 'zod'

const decisionSchema = z.object({
  stock_symbol: z.string(),
  current_price: z.number(),
  market_conditions: z.string().optional(),
  user_risk_profile: z.enum(['conservative', 'moderate', 'aggressive']),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      stock_symbol,
      current_price,
      market_conditions,
      user_risk_profile,
    } = decisionSchema.parse(body)

    const prompt = `You are a financial decision advisor. Provide investment recommendation for:

Stock: ${stock_symbol}
Current Price: $${current_price}
${market_conditions ? `Market Conditions: ${market_conditions}` : ''}
User Risk Profile: ${user_risk_profile}

Analyze and return JSON with:
{
  "recommendation": "buy" | "hold" | "sell" | "avoid",
  "confidence_score": 0.85,
  "price_target": 150.50,
  "reasoning": "Detailed reasoning for the recommendation",
  "risk_level": "low" | "medium" | "high"
}

Return ONLY valid JSON, no additional text.`

    const result = await generateAnalysis<DecisionResult>(prompt)

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('Decision analysis error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Decision analysis failed',
      },
      { status: 400 }
    )
  }
}
