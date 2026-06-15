import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { OpportunitiesService } from './opportunities.service';
import { OpportunityFinancialDetailDto } from './dto/opportunity-financial-detail.dto';
import { InvestorGuard } from '../auth/guards/investor.guard';

@Controller('opportunities')
@UseGuards(InvestorGuard)
export class OpportunitiesFinancialController {
  constructor(private readonly opportunitiesService: OpportunitiesService) {}

  @Get(':opportunityId/financial-detail')
  async getFinancialDetail(
    @Param('opportunityId') opportunityId: string,
  ): Promise<OpportunityFinancialDetailDto> {
    return this.opportunitiesService.getFinancialDetail(opportunityId);
  }
}
