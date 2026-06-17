import { Module } from '@nestjs/common';
import { SimulationController } from './simulation.controller';
import { SimulationConfirmController } from './simulation.confirm.controller';
import { SimulationService } from './simulation.service';
import { SimulationRepository } from './simulation.repository';
import { AuthModule } from '../auth/auth.module';
import { OpportunitiesModule } from '../opportunities/opportunities.module';
import { InvestmentIntentRepository } from './investment-intent.repository';

@Module({
  imports: [AuthModule, OpportunitiesModule],
  controllers: [SimulationController, SimulationConfirmController],
  providers: [
    SimulationService,
    SimulationRepository,
    InvestmentIntentRepository,
  ],
})
export class SimulationModule {}
