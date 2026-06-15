import { Test, TestingModule } from '@nestjs/testing';
import { SimulationRepository } from '../../src/simulation/simulation.repository';
import { PrismaService } from '../../src/prisma/prisma.service';

const mockPrismaService = () => ({
  investmentSimulation: {
    create: jest.fn(),
  },
});

describe('SimulationRepository', () => {
  let repository: SimulationRepository;
  let prisma: ReturnType<typeof mockPrismaService>;

  beforeEach(async () => {
    prisma = mockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SimulationRepository,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    repository = module.get<SimulationRepository>(SimulationRepository);
  });

  it('should create a simulation record', async () => {
    const investorId = 'investor-1';
    const opportunityId = 'opportunity-1';
    const amount = 5000;
    const estimatedReturn = 15;
    const riskLevel = 'medium';

    prisma.investmentSimulation.create.mockResolvedValue({
      id: 'simulation-1',
      investorId,
      opportunityId,
      amount: amount,
      estimatedReturn: estimatedReturn,
      riskLevel,
      simulatedAt: new Date('2025-06-14'),
    });

    const result = await repository.createSimulation({
      investorId,
      opportunityId,
      amount,
      estimatedReturn,
      riskLevel,
      estimatedProfit: 750,
      totalReturn: 5750,
    });

    expect(result.simulationId).toBe('simulation-1');
    expect(result.investmentAmount).toBe(amount);
    expect(result.estimatedProfit).toBe(750);
    expect(prisma.investmentSimulation.create).toHaveBeenCalledWith({
      data: {
        investorId,
        opportunityId,
        amount,
        estimatedReturn,
        riskLevel,
      },
      select: {
        id: true,
        investorId: true,
        opportunityId: true,
        amount: true,
        estimatedReturn: true,
        riskLevel: true,
        simulatedAt: true,
      },
    });
  });

  it('should calculate estimatedProfit correctly in response', async () => {
    const investorId = 'investor-1';
    const opportunityId = 'opportunity-1';
    const amount = 10000;
    const estimatedReturn = 20;

    prisma.investmentSimulation.create.mockResolvedValue({
      id: 'simulation-2',
      investorId,
      opportunityId,
      amount: amount,
      estimatedReturn: estimatedReturn,
      riskLevel: 'high',
      simulatedAt: new Date('2025-06-14'),
    });

    const result = await repository.createSimulation({
      investorId,
      opportunityId,
      amount,
      estimatedReturn,
      riskLevel: 'high',
      estimatedProfit: 2000,
      totalReturn: 12000,
    });

    expect(result.estimatedProfit).toBe(2000);
    expect(result.roiUsed).toBe(estimatedReturn);
  });
});
