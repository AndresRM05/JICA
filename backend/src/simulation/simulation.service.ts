import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { SimulationRepository } from './simulation.repository';
import { OpportunitiesRepository } from '../opportunities/opportunities.repository';
import { CreateSimulationDto } from './dto/create-simulation.dto';
import { SimulationResultDto } from './dto/simulation-result.dto';

@Injectable()
export class SimulationService {
  constructor(
    private readonly simulationRepository: SimulationRepository,
    private readonly opportunitiesRepository: OpportunitiesRepository,
  ) {}

  async createSimulation(
    opportunityId: string,
    investorId: string,
    createSimulationDto: CreateSimulationDto,
  ): Promise<SimulationResultDto> {
    const { investmentAmount } = createSimulationDto;

    // Obtener oportunidad
    const opportunity = await this.opportunitiesRepository.findById(opportunityId);

    if (!opportunity) {
      throw new NotFoundException(
        `Oportunidad de inversión con id ${opportunityId} no encontrada`,
      );
    }

    if (opportunity.status !== 'available') {
      throw new BadRequestException(
        `La oportunidad ${opportunityId} no está disponible para simulación`,
      );
    }

    // Validar monto mínimo
    if (investmentAmount < opportunity.minAmount) {
      throw new BadRequestException(
        `El monto mínimo de inversión es ${opportunity.minAmount}. Monto ingresado: ${investmentAmount}`,
      );
    }

    // Calcular utilidad estimada
    // estimatedReturn de opportunity está en porcentaje (ej: 15 para 15%)
    const estimatedProfit = (investmentAmount * opportunity.estimatedReturn) / 100;
    const totalReturn = investmentAmount + estimatedProfit;

    // Crear simulación en BD
    const simulation = await this.simulationRepository.createSimulation({
      investorId,
      opportunityId,
      amount: investmentAmount,
      estimatedReturn: opportunity.estimatedReturn,
      riskLevel: opportunity.riskLevel,
      estimatedProfit,
      totalReturn,
    });

    return simulation;
  }
}
