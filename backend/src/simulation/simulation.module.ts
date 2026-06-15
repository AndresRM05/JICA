import { Module } from '@nestjs/common';
import { SimulationController } from './simulation.controller';
import { SimulationService } from './simulation.service';
import { SimulationRepository } from './simulation.repository';
import { PrismaService } from '../prisma/prisma.service';
import { OpportunitiesRepository } from '../opportunities/opportunities.repository';
import { InvestorGuard } from '../auth/guards/investor.guard';

@Module({
  controllers: [SimulationController],
  providers: [SimulationService, SimulationRepository, PrismaService, OpportunitiesRepository, InvestorGuard],
})
export class SimulationModule {}
