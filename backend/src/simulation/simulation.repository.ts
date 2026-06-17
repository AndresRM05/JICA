import { Injectable } from '@nestjs/common';
import type { RiskLevel } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { SimulationResultDto } from './dto/simulation-result.dto';

interface CreateSimulationInput {
  investorId: string;
  opportunityId: string;
  amount: number;
  estimatedReturn: number;
  riskLevel: string;
  estimatedProfit: number;
  totalReturn: number;
}

@Injectable()
export class SimulationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createSimulation(input: CreateSimulationInput): Promise<SimulationResultDto> {
    const simulation = await this.prisma.investmentSimulation.create({
      data: {
        investorId: input.investorId,
        opportunityId: input.opportunityId,
        amount: input.amount,
        estimatedReturn: input.estimatedReturn,
        riskLevel: input.riskLevel as RiskLevel,
      },
      select: {
        id: true,
        investorId: true,
        opportunityId: true,
        amount: true,
        estimatedReturn: true,
        riskLevel: true,
        simulatedAt: true,
      },
    });

    // Calcular estimatedProfit y totalReturn basado en amount y estimatedReturn (porcentaje)
    const estimatedProfit = (Number(simulation.amount) * Number(simulation.estimatedReturn)) / 100;
    const totalReturn = Number(simulation.amount) + estimatedProfit;

    return {
      simulationId: simulation.id,
      opportunityId: simulation.opportunityId,
      investorId: simulation.investorId,
      investmentAmount: Number(simulation.amount),
      totalReturn,
      estimatedProfit,
      roiUsed: Number(simulation.estimatedReturn),
      riskLevel: simulation.riskLevel,
      simulatedAt: simulation.simulatedAt,
    };
  }

  async findById(simulationId: string) {
    const simulation = await this.prisma.investmentSimulation.findUnique({
      where: { id: simulationId },
      select: {
        id: true,
        investorId: true,
        opportunityId: true,
        amount: true,
        estimatedReturn: true,
        riskLevel: true,
        simulatedAt: true,
      },
    });

    if (!simulation) return null;

    return {
      simulationId: simulation.id,
      investorId: simulation.investorId,
      opportunityId: simulation.opportunityId,
      amount: Number(simulation.amount),
      estimatedReturn: Number(simulation.estimatedReturn),
      riskLevel: simulation.riskLevel,
      simulatedAt: simulation.simulatedAt,
    };
  }
}
