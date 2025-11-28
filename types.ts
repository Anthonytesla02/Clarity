export interface DecisionFactor {
  name: string;
  weight: number; // 0-10 importance
  description: string;
}

export interface OptionScore {
  optionName: string;
  score: number; // 0-100 performance in this factor
  reasoning: string;
}

export interface AnalysisResult {
  winner: string;
  confidence: number; // 0-100
  summary: string;
  factors: DecisionFactor[];
  scores: Record<string, OptionScore[]>; // Key is factor name
  overallScores: { optionName: string; totalScore: number }[];
}

export interface HistoryItem {
  id: string;
  dilemma: string;
  date: string;
  winner: string;
}

export enum AppState {
  INPUT = 'INPUT',
  OPTIONS = 'OPTIONS',
  ANALYZING = 'ANALYZING',
  RESULT = 'RESULT',
  HISTORY = 'HISTORY'
}