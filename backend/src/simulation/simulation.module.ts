import { Module } from '@nestjs/common';
import { SimulationController } from './simulation.controller';
import { SimulationConfirmController } from './simulation.confirm.controller';
import { SimulationService } from './simulation.service';
import { SimulationRepository } from './simulation.repository';
import { OpportunitiesModule } from '../opportunities/opportunities.module';
import { InvestorGuard } from '../auth/guards/investor.guard';
import { InvestmentIntentRepository } from './investment-intent.repository';

@Module({
  imports: [OpportunitiesModule],
  controllers: [SimulationController, SimulationConfirmController],
  providers: [
    SimulationService,
    SimulationRepository,
    InvestmentIntentRepository,
    InvestorGuard,
  ],
})
export class SimulationModule {}
