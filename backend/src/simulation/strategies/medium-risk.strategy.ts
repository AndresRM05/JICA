import { RiskStrategy } from './risk-strategy.interface';

export class MediumRiskStrategy implements RiskStrategy {
  calculateRisk(score: number): string {
    return 'MEDIUM';
  }
}