import { Module } from '@nestjs/common';
import { OpportunitiesController } from './opportunities.controller';
import { OpportunitiesFinancialController } from './opportunities.financial.controller';
import { OpportunitiesService } from './opportunities.service';
import { OpportunitiesRepository } from './opportunities.repository';
import { InvestorGuard } from '../auth/guards/investor.guard';

@Module({
  controllers: [OpportunitiesController, OpportunitiesFinancialController],
  providers: [OpportunitiesService, OpportunitiesRepository, InvestorGuard],
  exports: [OpportunitiesService],
})
export class OpportunitiesModule {}
