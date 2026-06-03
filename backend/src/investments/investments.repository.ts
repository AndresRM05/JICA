// /backend/src/investments/investments.repository.ts
@Injectable()
export class InvestmentsRepository {
  constructor(private readonly prisma: PrismaService) {}
 
  async findById(id: string): Promise<InvestmentResponseDto | null> {
    return this.prisma.investment.findUnique({
      where: { id },
      select: {
        id: true,
        businessName: true,
        roi: true,
        riskLevel: true,
        minAmount: true,
        status: true,
        // accountNumber, taxId y documentos internos nunca se seleccionan
      },
    });
  }
 
  async registerInterest(investmentId: string, investorId: string): Promise<void> {
    try {
      await this.prisma.investmentInterest.create({
        data: { investmentId, investorId },
      });
    } catch {
      throw new InternalServerErrorException('Error al registrar interés de inversión');
    }
  }
}