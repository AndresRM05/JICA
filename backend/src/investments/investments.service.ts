// /backend/src/investments/investments.service.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InvestmentsRepository } from './investments.repository';
import { InvestmentResponseDto } from './dto/investment-response.dto';

@Injectable()
export class InvestmentsService {
  constructor(private readonly investmentsRepository: InvestmentsRepository) {}

  async findAll(filters: any): Promise<InvestmentResponseDto[]> {
    return [];
  }
 
  async findOne(opportunityId: string): Promise<InvestmentResponseDto> {
    const investment = await this.investmentsRepository.findById(opportunityId);
    if (!investment) {
      throw new NotFoundException(`Oportunidad de inversión con id ${opportunityId} no encontrada`);
    }
    return investment;
  }
 
  async registerInterest(opportunityId: string, investorId: string): Promise<void> {
    const opportunity = await this.investmentsRepository.findById(opportunityId);

    if (!opportunity) {
      throw new NotFoundException(`Oportunidad de inversión con id ${opportunityId} no encontrada`);
    }
    if (opportunity.status !== 'available') {
      throw new BadRequestException('Solo se puede registrar interés en oportunidades disponibles');
    }

    await this.investmentsRepository.registerInterest(opportunityId, investorId);
  }
}