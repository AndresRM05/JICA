import { Test, TestingModule } from '@nestjs/testing';
import { InvestmentsRepository } from '../../src/investments/investments.repository';
import { PrismaService } from '../../src/prisma/prisma.service';

const mockPrismaService = () => ({
  investmentOpportunity: {
    findUnique: jest.fn(),
  },
  investmentIntent: {
    create: jest.fn(),
  },
});

describe('InvestmentsRepository', () => {
  let repository: InvestmentsRepository;
  let prisma: ReturnType<typeof mockPrismaService>;

  beforeEach(async () => {
    prisma = mockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvestmentsRepository,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    repository = module.get<InvestmentsRepository>(InvestmentsRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('findById should query Prisma with opportunityId', async () => {
    prisma.investmentOpportunity.findUnique.mockResolvedValue({
      id: 'opportunity-1',
      businessName: 'Prueba',
      estimatedReturn: 0.15,
      riskLevel: 'medium',
      minAmount: 1000,
      status: 'available',
    });

    const result = await repository.findById('opportunity-1');

    expect(prisma.investmentOpportunity.findUnique).toHaveBeenCalledWith({
      where: { id: 'opportunity-1' },
      select: {
        id: true,
        businessName: true,
        estimatedReturn: true,
        riskLevel: true,
        minAmount: true,
        status: true,
      },
    });
    expect(result).toEqual(expect.objectContaining({ id: 'opportunity-1' }));
  });

  it('registerInterest should create investment intent in Prisma', async () => {
    prisma.investmentIntent.create.mockResolvedValue({});

    await repository.registerInterest('opportunity-1', 'investor-1');

    expect(prisma.investmentIntent.create).toHaveBeenCalledWith({
      data: {
        opportunityId: 'opportunity-1',
        investorId: 'investor-1',
        amount: 0,
        expectedReturn: 0,
        status: 'pending',
      },
    });
  });
});
