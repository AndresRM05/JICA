import { Module } from '@nestjs/common';
import { OpportunitiesController } from './opportunities.controller';
import { OpportunitiesFinancialController } from './opportunities.financial.controller';
import { OpportunitiesService } from './opportunities.service';
import { OpportunitiesRepository } from './opportunities.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [OpportunitiesController, OpportunitiesFinancialController],
  providers: [OpportunitiesService, OpportunitiesRepository],
  exports: [OpportunitiesService],
})
export class OpportunitiesModule {}
