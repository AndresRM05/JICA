import { RiskStrategy } from './risk-strategy.interface';

export class RiskContextService {
  constructor(private strategy: RiskStrategy) {}

  setStrategy(strategy: RiskStrategy): void {
    this.strategy = strategy;
  }

  calculate(score: number): string {
    return this.strategy.calculateRisk(score);
  }
}