export enum Sentiment {
  Positive = 'Positive',
  Neutral = 'Neutral',
  Negative = 'Negative',
}

export interface FeedbackItem {
  id: string;
  source: 'Twitter' | 'Review' | 'Email' | 'Support' | 'Direct Input';
  text: string;
  date: string;
  sentiment: Sentiment;
  emotion: string;
  topics: string[];
  intensity: number; // 1-10
  actionableInsight?: string;
}

export interface AnalysisResponse {
  sentiment: Sentiment;
  emotion: string;
  intensity: number;
  topics: string[];
  actionableInsight: string;
}

export interface ExecutiveSummary {
  overview: string;
  topIssues: string[];
  recommendations: string[];
  generatedAt: string;
}

export type ViewState = 'dashboard' | 'analyze' | 'reports';
