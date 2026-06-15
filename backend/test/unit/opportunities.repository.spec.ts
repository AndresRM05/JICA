import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../src/prisma/prisma.service';
import { OpportunitiesRepository } from '../../src/opportunities/opportunities.repository';

const mockPrismaService = () => ({
  investmentOpportunity: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
  },
});

describe('OpportunitiesRepository', () => {
  let repository: OpportunitiesRepository;
  let prisma: ReturnType<typeof mockPrismaService>;

  beforeEach(async () => {
    prisma = mockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OpportunitiesRepository,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    repository = module.get<OpportunitiesRepository>(OpportunitiesRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('findAllAvailable should query available opportunities', async () => {
    prisma.investmentOpportunity.findMany.mockResolvedValue([]);

    await repository.findAllAvailable();

    expect(prisma.investmentOpportunity.findMany).toHaveBeenCalledWith({
      where: { status: 'available' },
      select: {
        id: true,
        title: true,
        businessName: true,
        category: true,
        location: true,
        targetAmount: true,
        currentAmount: true,
        minAmount: true,
        riskLevel: true,
        estimatedReturn: true,
        status: true,
      },
    });
  });

  it('findById should query opportunity by id', async () => {
    prisma.investmentOpportunity.findUnique.mockResolvedValue(null);

    await repository.findById('opportunity-1');

    expect(prisma.investmentOpportunity.findUnique).toHaveBeenCalledWith({
      where: { id: 'opportunity-1' },
      select: {
        id: true,
        title: true,
        businessName: true,
        category: true,
        location: true,
        targetAmount: true,
        currentAmount: true,
        minAmount: true,
        riskLevel: true,
        estimatedReturn: true,
        status: true,
      },
    });
  });
});
