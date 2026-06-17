// /backend/src/investments/investments.controller.ts
import { Controller, Get, Post, Param, Query, UseGuards } from '@nestjs/common';
import { InvestmentsService } from './investments.service';
import { GetInvestmentsQueryDto } from './dto/get-investments-query.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/auth.types';
import { Roles } from '../auth/decorators/roles.decorator';
import { InvestorGuard } from '../auth/guards/investor.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('investments')
@UseGuards(InvestorGuard, RolesGuard)
export class InvestmentsController {
  constructor(private readonly investmentsService: InvestmentsService) {}
 
  @Get()
  @Roles('investor', 'admin')
  findAll(@Query() filters: GetInvestmentsQueryDto) {
    return this.investmentsService.findAll(filters);
  }
 
  @Get(':opportunityId')
  @Roles('investor', 'admin')
  findOne(@Param('opportunityId') opportunityId: string) {
    return this.investmentsService.findOne(opportunityId);
  }
 
  @Post(':opportunityId/interest')
  @Roles('investor')
  registerInterest(
    @Param('opportunityId') opportunityId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.investmentsService.registerInterest(opportunityId, user.investorId ?? user.id);
  }
}
