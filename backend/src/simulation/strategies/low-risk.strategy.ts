import { RiskStrategy } from './risk-strategy.interface';

export class LowRiskStrategy implements RiskStrategy {
  calculateRisk(score: number): string {
    return 'LOW';
  }
}