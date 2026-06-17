// /backend/src/investments/investments.repository.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InvestmentResponseDto } from './dto/investment-response.dto';

@Injectable()
export class InvestmentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(opportunityId: string): Promise<InvestmentResponseDto | null> {
    const opportunity = await this.prisma.investmentOpportunity.findUnique({
      where: { id: opportunityId },
      select: {
        id: true,
        businessName: true,
        estimatedReturn: true,
        riskLevel: true,
        minAmount: true,
        status: true,
      },
    });

    if (!opportunity) return null;

    return {
      id: opportunity.id,
      businessName: opportunity.businessName,
      estimatedReturn: Number(opportunity.estimatedReturn),
      riskLevel: opportunity.riskLevel,
      minAmount: Number(opportunity.minAmount),
      status: opportunity.status,
    };
  }

  async registerInterest(opportunityId: string, investorId: string): Promise<void> {
    try {
      await this.prisma.investmentIntent.create({
        data: {
          opportunityId,
          investorId,
          amount: 0,
          expectedReturn: 0,
          status: 'pending',
        },
      });
    } catch {
      throw new InternalServerErrorException('Error al registrar interés de inversión');
    }
  }
}
