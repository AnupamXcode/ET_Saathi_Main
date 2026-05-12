// User Types
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

// Portfolio Types
export interface Portfolio {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  total_value: number;
  created_at: string;
  updated_at: string;
}

export interface PortfolioHolding {
  id: string;
  portfolio_id: string;
  symbol: string;
  quantity: number;
  average_price: number;
  current_price: number;
  created_at: string;
  updated_at: string;
}

// Analysis Types
export interface NewsAnalysisRequest {
  news_text: string;
  user_context?: string;
}

export interface NewsAnalysisResult {
  summary: string;
  sentiment: "positive" | "negative" | "neutral";
  affected_sectors: string[];
  affected_stocks: string[];
  market_impact: string;
  recommendations: string[];
  confidence_score: number;
}

// Scenario Types
export interface ScenarioRequest {
  scenario_description: string;
  user_portfolio?: PortfolioHolding[];
}

export interface ScenarioResult {
  scenario_name: string;
  description: string;
  sector_impacts: SectorImpact[];
  portfolio_impact: number;
  recommended_actions: string[];
  risk_level: "low" | "medium" | "high";
}

export interface SectorImpact {
  sector_name: string;
  impact_percentage: number;
  affected_companies: string[];
}

// Decision Engine Types
export interface DecisionRequest {
  stock_symbol: string;
  current_price: number;
  market_conditions: string;
  user_risk_profile: "conservative" | "moderate" | "aggressive";
}

export interface DecisionResult {
  recommendation: "buy" | "hold" | "sell" | "avoid";
  confidence_score: number;
  price_target: number;
  reasoning: string;
  risk_level: "low" | "medium" | "high";
}

// Simulation Types
export interface SimulationRequest {
  initial_investment: number;
  duration_months: number;
  asset_allocation: Record<string, number>;
  market_scenario: string;
}

export interface SimulationResult {
  final_value: number;
  total_return: number;
  annual_return: number;
  max_drawdown: number;
  monthly_performance: number[];
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// History Types
export interface Analysis {
  id: string;
  user_id: string;
  type: "news" | "scenario" | "decision" | "simulation";
  input: Record<string, any>;
  result: Record<string, any>;
  created_at: string;
}
