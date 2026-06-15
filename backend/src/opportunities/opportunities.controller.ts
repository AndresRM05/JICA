import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { OpportunitiesService } from './opportunities.service';
import { OpportunitySummaryDto } from './dto/opportunity-summary.dto';
import { InvestorGuard } from '../auth/guards/investor.guard';

@Controller('opportunities')
@UseGuards(InvestorGuard)
export class OpportunitiesController {
  constructor(private readonly opportunitiesService: OpportunitiesService) {}

  @Get()
  async findAll(): Promise<OpportunitySummaryDto[]> {
    return this.opportunitiesService.findAll();
  }

  @Get(':opportunityId')
  async findOne(@Param('opportunityId') opportunityId: string): Promise<OpportunitySummaryDto> {
    return this.opportunitiesService.findOne(opportunityId);
  }
}
