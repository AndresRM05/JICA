import { RiskStrategy } from './risk-strategy.interface';

export class HighRiskStrategy implements RiskStrategy {
  calculateRisk(score: number): string {
    return 'HIGH';
  }
}