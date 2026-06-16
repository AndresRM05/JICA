import { Module } from '@nestjs/common';
import { InvestmentsController } from './investments.controller';
import { InvestmentsService } from './investments.service';
import { InvestmentsRepository } from './investments.repository';
import { EntraIdGuard } from '../auth/guards/entra-id.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Module({
  controllers: [InvestmentsController],
  providers: [InvestmentsService, InvestmentsRepository, EntraIdGuard, RolesGuard],
})
export class InvestmentsModule {}
