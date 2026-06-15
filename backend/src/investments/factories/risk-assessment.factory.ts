export interface RiskAssessment {
  level: string;
}

export class LowRiskAssessment implements RiskAssessment {
  level = 'LOW';
}

export class MediumRiskAssessment implements RiskAssessment {
  level = 'MEDIUM';
}

export class HighRiskAssessment implements RiskAssessment {
  level = 'HIGH';
}

export class RiskAssessmentFactory {
  static create(score: number): RiskAssessment {
    if (score >= 80) {
      return new LowRiskAssessment();
    }

    if (score >= 50) {
      return new MediumRiskAssessment();
    }

    return new HighRiskAssessment();
  }
}

// Example usage:

/*
const assessment =
  RiskAssessmentFactory.create(75);

console.log(assessment.level); 

*/