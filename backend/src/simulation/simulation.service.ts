import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { SimulationRepository } from './simulation.repository';
import { OpportunitiesService } from '../opportunities/opportunities.service';
import { CreateSimulationDto } from './dto/create-simulation.dto';
import { SimulationResultDto } from './dto/simulation-result.dto';
import { InvestmentIntentRepository } from './investment-intent.repository';
import { ConfirmIntentResultDto } from './dto/confirm-intent-result.dto';

@Injectable()
export class SimulationService {
  constructor(
    private readonly simulationRepository: SimulationRepository,
    private readonly opportunitiesService: OpportunitiesService,
    private readonly investmentIntentRepository: InvestmentIntentRepository,
  ) {}

  async createSimulation(
    opportunityId: string,
    investorId: string,
    createSimulationDto: CreateSimulationDto,
  ): Promise<SimulationResultDto> {
    const { investmentAmount } = createSimulationDto;

    // Obtener oportunidad
    const opportunity = await this.opportunitiesService.findOne(opportunityId);

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

  async confirmSimulation(simulationId: string, investorId: string): Promise<ConfirmIntentResultDto> {
    // Obtener simulación
    const simulation = await this.simulationRepository.findById(simulationId);
    if (!simulation) {
      throw new NotFoundException(`Simulación con id ${simulationId} no encontrada`);
    }

    // Verificar pertenencia
    if (simulation.investorId !== investorId) {
      throw new BadRequestException('La simulación no pertenece al usuario autenticado');
    }

    // Verificar oportunidad
    const opportunity = await this.opportunitiesService.findOne(simulation.opportunityId);
    if (!opportunity) {
      throw new NotFoundException(`Oportunidad asociada con id ${simulation.opportunityId} no encontrada`);
    }

    if (opportunity.status !== 'available') {
      throw new BadRequestException('La oportunidad no está disponible para confirmar intención');
    }

    // Verificar intención existente
    const existing = await this.investmentIntentRepository.findBySimulationId(simulationId);
    if (existing && existing.status === 'confirmed') {
      throw new BadRequestException('Ya existe una intención confirmada para esta simulación');
    }

    // Calcular valores
    const roiUsed = Number(simulation.estimatedReturn);
    const estimatedProfit = (Number(simulation.amount) * roiUsed) / 100;
    const totalReturn = Number(simulation.amount) + estimatedProfit;

    // Crear intención en BD
    const intent = await this.investmentIntentRepository.createIntent({
      investorId,
      opportunityId: simulation.opportunityId,
      simulationId: simulationId,
      amount: Number(simulation.amount),
      expectedReturn: totalReturn,
      status: 'confirmed',
      confirmedAt: new Date(),
    });

    return {
      intentId: intent.id,
      simulationId: intent.simulationId ?? simulationId,
      opportunityId: intent.opportunityId,
      investorId: intent.investorId,
      amount: Number(intent.amount),
      expectedReturn: Number(intent.expectedReturn),
      status: intent.status,
      confirmedAt: intent.confirmedAt,
      message: 'Intent confirmed',
    };
  }
}
