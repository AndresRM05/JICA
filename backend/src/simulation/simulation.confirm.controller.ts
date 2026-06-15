import { Controller, Post, Param, UseGuards, Req } from '@nestjs/common';
import { SimulationService } from './simulation.service';
import { InvestorGuard } from '../auth/guards/investor.guard';
import { ConfirmIntentResultDto } from './dto/confirm-intent-result.dto';

@Controller('simulations')
@UseGuards(InvestorGuard)
export class SimulationConfirmController {
  constructor(private readonly simulationService: SimulationService) {}

  @Post(':simulationId/confirm')
  async confirmSimulation(
    @Param('simulationId') simulationId: string,
    @Req() request: any,
  ): Promise<ConfirmIntentResultDto> {
    const investorId = request.user.investorId;
    return this.simulationService.confirmSimulation(simulationId, investorId);
  }
}
