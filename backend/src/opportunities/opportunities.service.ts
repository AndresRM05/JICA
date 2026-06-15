import { Injectable, NotFoundException } from '@nestjs/common';
import { OpportunitiesRepository } from './opportunities.repository';
import { OpportunitySummaryDto } from './dto/opportunity-summary.dto';
import { OpportunityFinancialDetailDto } from './dto/opportunity-financial-detail.dto';

@Injectable()
export class OpportunitiesService {
  constructor(private readonly opportunitiesRepository: OpportunitiesRepository) {}

  async findAll(): Promise<OpportunitySummaryDto[]> {
    return this.opportunitiesRepository.findAllAvailable();
  }

  async findOne(opportunityId: string): Promise<OpportunitySummaryDto> {
    const opportunity = await this.opportunitiesRepository.findById(opportunityId);
    if (!opportunity) {
      throw new NotFoundException(`Oportunidad de inversión con id ${opportunityId} no encontrada`);
    }
    return opportunity;
  }

  async getFinancialDetail(opportunityId: string): Promise<OpportunityFinancialDetailDto> {
    const opportunity = await this.opportunitiesRepository.findFinancialDetailById(opportunityId);
    if (!opportunity) {
      throw new NotFoundException(`Oportunidad de inversión con id ${opportunityId} no encontrada`);
    }
    return opportunity;
  }
}
