import { Body, Controller, Param, Post, UseGuards, Req } from '@nestjs/common';
import { SimulationService } from './simulation.service';
import { CreateSimulationDto } from './dto/create-simulation.dto';
import { SimulationResultDto } from './dto/simulation-result.dto';
import { InvestorGuard } from '../auth/guards/investor.guard';

@Controller('opportunities')
@UseGuards(InvestorGuard)
export class SimulationController {
  constructor(private readonly simulationService: SimulationService) {}

  @Post(':opportunityId/simulations')
  async createSimulation(
    @Param('opportunityId') opportunityId: string,
    @Body() createSimulationDto: CreateSimulationDto,
    @Req() request: any,
  ): Promise<SimulationResultDto> {
    const investorId = request.user.investorId;
    return this.simulationService.createSimulation(opportunityId, investorId, createSimulationDto);
  }
}
