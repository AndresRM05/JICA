import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { InvestmentIntentStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InvestmentIntentRepository {
  private readonly logger = new Logger(InvestmentIntentRepository.name);

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
      const intent = await this.prisma.investmentIntent.upsert({
        where: {
          investorId_opportunityId: {
            investorId: data.investorId,
            opportunityId: data.opportunityId,
          },
        },
        update: {
          simulationId: data.simulationId,
          amount: data.amount,
          expectedReturn: data.expectedReturn,
          status: data.status,
          confirmedAt: data.confirmedAt ?? null,
        },
        create: {
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
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        this.logger.error(`No se pudo guardar la intención de inversión. Código Prisma: ${error.code}`);
      } else {
        this.logger.error('No se pudo guardar la intención de inversión', error);
      }

      throw new InternalServerErrorException('No se pudo registrar la intención de inversión');
    }
  }
}
