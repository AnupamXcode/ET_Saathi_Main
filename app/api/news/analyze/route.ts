import { NextRequest, NextResponse } from 'next/server'
import { generateAnalysis } from '@/services/gemini'
import { NewsAnalysisResult } from '@/types'
import { z } from 'zod'

const newsAnalysisSchema = z.object({
  news_text: z.string().min(10),
  user_context: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { news_text, user_context } = newsAnalysisSchema.parse(body)

    const prompt = `You are a financial analyst. Analyze the following financial news and provide a structured JSON response with these exact fields:

News: ${news_text}

${user_context ? `User Context: ${user_context}` : ''}

Provide a JSON response with:
{
  "summary": "Brief 1-2 sentence summary",
  "sentiment": "positive" | "negative" | "neutral",
  "affected_sectors": ["sector1", "sector2"],
  "affected_stocks": ["SYMBOL1", "SYMBOL2"],
  "market_impact": "Detailed market impact analysis",
  "recommendations": ["action1", "action2"],
  "confidence_score": 0.85
}

Return ONLY valid JSON, no additional text.`

    const result = await generateAnalysis<NewsAnalysisResult>(prompt)

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('News analysis error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Analysis failed',
      },
      { status: 400 }
    )
  }
}
