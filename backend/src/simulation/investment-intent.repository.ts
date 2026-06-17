import { Injectable, InternalServerErrorException } from '@nestjs/common';
import type { InvestmentIntentStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InvestmentIntentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findBySimulationId(simulationId: string) {
    return this.prisma.investmentIntent.findFirst({
      where: { simulationId },
      select: {
        id: true,
        investorId: true,
        opportunityId: true,
        simulationId: true,
        amount: true,
        expectedReturn: true,
        status: true,
        confirmedAt: true,
      },
    });
  }

  async createIntent(data: {
    investorId: string;
    opportunityId: string;
    simulationId?: string | null;
    amount: number;
    expectedReturn: number;
    status: InvestmentIntentStatus;
    confirmedAt?: Date | null;
  }) {
    try {
      const intent = await this.prisma.investmentIntent.create({
        data: {
          investorId: data.investorId,
          opportunityId: data.opportunityId,
          simulationId: data.simulationId,
          amount: data.amount,
          expectedReturn: data.expectedReturn,
          status: data.status,
          confirmedAt: data.confirmedAt ?? null,
        },
        select: {
          id: true,
          investorId: true,
          opportunityId: true,
          simulationId: true,
          amount: true,
          expectedReturn: true,
          status: true,
          confirmedAt: true,
        },
      });

      return intent;
    } catch (e) {
      throw new InternalServerErrorException('Error creating investment intent');
    }
  }
}
