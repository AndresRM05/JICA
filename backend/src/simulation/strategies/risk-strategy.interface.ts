export interface RiskStrategy {
  calculateRisk(score: number): string;
}