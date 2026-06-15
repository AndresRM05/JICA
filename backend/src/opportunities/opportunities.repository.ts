import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OpportunitySummaryDto } from './dto/opportunity-summary.dto';
import { OpportunityFinancialDetailDto, FinancialMetricDto } from './dto/opportunity-financial-detail.dto';

@Injectable()
export class OpportunitiesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllAvailable(): Promise<OpportunitySummaryDto[]> {
    const opportunities = await this.prisma.investmentOpportunity.findMany({
      where: {
        status: 'available',
      },
      select: {
        id: true,
        title: true,
        businessName: true,
        category: true,
        location: true,
        targetAmount: true,
        currentAmount: true,
        minAmount: true,
        riskLevel: true,
        estimatedReturn: true,
        status: true,
      },
    });

    return opportunities.map((item) => ({
      opportunityId: item.id,
      title: item.title,
      businessName: item.businessName,
      category: item.category,
      location: item.location,
      targetAmount: Number(item.targetAmount),
      currentAmount: Number(item.currentAmount),
      minAmount: Number(item.minAmount),
      riskLevel: item.riskLevel,
      estimatedReturn: Number(item.estimatedReturn),
      status: item.status,
    }));
  }

  async findById(opportunityId: string): Promise<OpportunitySummaryDto | null> {
    const opportunity = await this.prisma.investmentOpportunity.findUnique({
      where: { id: opportunityId },
      select: {
        id: true,
        title: true,
        businessName: true,
        category: true,
        location: true,
        targetAmount: true,
        currentAmount: true,
        minAmount: true,
        riskLevel: true,
        estimatedReturn: true,
        status: true,
      },
    });

    if (!opportunity) {
      return null;
    }

    return {
      opportunityId: opportunity.id,
      title: opportunity.title,
      businessName: opportunity.businessName,
      category: opportunity.category,
      location: opportunity.location,
      targetAmount: Number(opportunity.targetAmount),
      currentAmount: Number(opportunity.currentAmount),
      minAmount: Number(opportunity.minAmount),
      riskLevel: opportunity.riskLevel,
      estimatedReturn: Number(opportunity.estimatedReturn),
      status: opportunity.status,
    };
  }

  async findFinancialDetailById(opportunityId: string): Promise<OpportunityFinancialDetailDto | null> {
    const opportunity = await this.prisma.investmentOpportunity.findUnique({
      where: { id: opportunityId },
      select: {
        id: true,
        title: true,
        businessName: true,
        category: true,
        location: true,
        description: true,
        targetAmount: true,
        currentAmount: true,
        minAmount: true,
        estimatedReturn: true,
        riskLevel: true,
        status: true,
        metrics: {
          select: {
            month: true,
            revenue: true,
            grossMargin: true,
            operatingMargin: true,
            customerCount: true,
            averageTicket: true,
          },
        },
      },
    });

    if (!opportunity || opportunity.status !== 'available') {
      return null;
    }

    const financialMetrics: FinancialMetricDto[] = opportunity.metrics.map((metric) => ({
      month: metric.month,
      revenue: Number(metric.revenue),
      grossMargin: Number(metric.grossMargin),
      operatingMargin: Number(metric.operatingMargin),
      customerCount: metric.customerCount,
      averageTicket: metric.averageTicket ? Number(metric.averageTicket) : null,
    }));

    return {
      opportunityId: opportunity.id,
      title: opportunity.title,
      businessName: opportunity.businessName,
      category: opportunity.category,
      location: opportunity.location,
      description: opportunity.description,
      targetAmount: Number(opportunity.targetAmount),
      currentAmount: Number(opportunity.currentAmount),
      minAmount: Number(opportunity.minAmount),
      estimatedReturn: Number(opportunity.estimatedReturn),
      riskLevel: opportunity.riskLevel,
      status: opportunity.status,
      financialMetrics,
      riskSummary: `Nivel de riesgo ${opportunity.riskLevel}`,
    };
  }
}
