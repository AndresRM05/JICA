import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { OpportunitiesModule } from './opportunities/opportunities.module';
import { SimulationModule } from './simulation/simulation.module';

@Module({
  imports: [AuthModule, OpportunitiesModule, SimulationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
