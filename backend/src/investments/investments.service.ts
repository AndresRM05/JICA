// /backend/src/investments/investments.service.ts
@Injectable()
export class InvestmentsService {
  constructor(private readonly investmentsRepository: InvestmentsRepository) {}
 
  async findOne(id: string): Promise<InvestmentResponseDto> {
    const investment = await this.investmentsRepository.findById(id);
    if (!investment) {
      throw new NotFoundException(`Inversión con id ${id} no encontrada`);
    }
    return investment;
  }
 
  async registerInterest(investmentId: string, investorId: string): Promise<void> {
    const investment = await this.investmentsRepository.findById(investmentId);
 
    if (!investment) {
      throw new NotFoundException(`Inversión con id ${investmentId} no encontrada`);
    }
    if (investment.status !== 'available') {
      throw new BadRequestException('Solo se puede registrar interés en inversiones disponibles');
    }
 
    await this.investmentsRepository.registerInterest(investmentId, investorId);
  }
}