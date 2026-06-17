import { Module } from '@nestjs/common';
import { InvestmentsController } from './investments.controller';
import { InvestmentsService } from './investments.service';
import { InvestmentsRepository } from './investments.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [InvestmentsController],
  providers: [InvestmentsService, InvestmentsRepository],
})
export class InvestmentsModule {}
