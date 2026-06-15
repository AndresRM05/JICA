import { Module } from '@nestjs/common';
import { SimulationController } from './simulation.controller';
import { SimulationConfirmController } from './simulation.confirm.controller';
import { SimulationService } from './simulation.service';
import { SimulationRepository } from './simulation.repository';
import { PrismaService } from '../prisma/prisma.service';
import { OpportunitiesRepository } from '../opportunities/opportunities.repository';
import { InvestorGuard } from '../auth/guards/investor.guard';
import { InvestmentIntentRepository } from './investment-intent.repository';

@Module({
  controllers: [SimulationController, SimulationConfirmController],
  providers: [
    SimulationService,
    SimulationRepository,
    InvestmentIntentRepository,
    PrismaService,
    OpportunitiesRepository,
    InvestorGuard,
  ],
})
export class SimulationModule {}
