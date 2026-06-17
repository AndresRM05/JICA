import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { InvestorGuard } from './guards/investor.guard';
import { RolesGuard } from './guards/roles.guard';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, InvestorGuard, RolesGuard],
  exports: [AuthService, InvestorGuard, RolesGuard],
})
export class AuthModule {}
