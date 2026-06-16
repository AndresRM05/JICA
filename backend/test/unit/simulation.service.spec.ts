import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { SimulationService } from '../../src/simulation/simulation.service';
import { SimulationRepository } from '../../src/simulation/simulation.repository';
import { OpportunitiesService } from '../../src/opportunities/opportunities.service';
import { InvestmentIntentRepository } from '../../src/simulation/investment-intent.repository';

const mockSimulationRepository = () => ({
  createSimulation: jest.fn(),
});

const mockOpportunitiesService = () => ({
  findOne: jest.fn(),
});

describe('SimulationService', () => {
  let service: SimulationService;
  let simulationRepository: ReturnType<typeof mockSimulationRepository>;
  let opportunitiesService: ReturnType<typeof mockOpportunitiesService>;

  beforeEach(async () => {
    simulationRepository = mockSimulationRepository();
    opportunitiesService = mockOpportunitiesService();


    const mockInvestmentIntentRepository = mockSimulationRepository();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SimulationService,
        {
          provide: SimulationRepository,
          useValue: simulationRepository,
        },
        {
          provide: OpportunitiesService,
          useValue: opportunitiesService,
        },
        {
          provide: InvestmentIntentRepository,
          useValue: mockInvestmentIntentRepository,
        },
      ],
    }).compile();

    service = module.get<SimulationService>(SimulationService);
  });

  it('should create a successful simulation with valid amount', async () => {
    const opportunityId = 'opportunity-1';
    const investorId = 'investor-1';
    const investmentAmount = 5000;

    opportunitiesService.findOne.mockResolvedValue({
      opportunityId,
      title: 'Oportunidad A',
      businessName: 'Negocio A',
      category: 'Gastronomía',
      location: 'Ciudad',
      targetAmount: 10000,
      currentAmount: 2500,
      minAmount: 1000,
      riskLevel: 'medium',
      estimatedReturn: 15,
      status: 'available',
    });

    simulationRepository.createSimulation.mockResolvedValue({
      simulationId: 'simulation-1',
      opportunityId,
      investorId,
      investmentAmount,
      totalReturn: 5750,
      estimatedProfit: 750,
      roiUsed: 15,
      riskLevel: 'medium',
      simulatedAt: new Date('2025-06-14'),
    });

    const result = await service.createSimulation(opportunityId, investorId, {
      investmentAmount,
    });

    expect(result.simulationId).toBe('simulation-1');
    expect(result.estimatedProfit).toBe(750);
    expect(result.investmentAmount).toBe(investmentAmount);
    expect(simulationRepository.createSimulation).toHaveBeenCalledWith(
      expect.objectContaining({
        investorId,
        opportunityId,
        amount: investmentAmount,
        estimatedReturn: 15,
      }),
    );
  });

  it('should throw NotFoundException when opportunity does not exist', async () => {
    const opportunityId = 'missing-opportunity';
    const investorId = 'investor-1';

    opportunitiesService.findOne.mockResolvedValue(null);

    await expect(
      service.createSimulation(opportunityId, investorId, { investmentAmount: 5000 }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException when opportunity is not available', async () => {
    const opportunityId = 'opportunity-1';
    const investorId = 'investor-1';

    opportunitiesService.findOne.mockResolvedValue({
      opportunityId,
      title: 'Oportunidad A',
      businessName: 'Negocio A',
      category: 'Gastronomía',
      location: 'Ciudad',
      targetAmount: 10000,
      currentAmount: 10000,
      minAmount: 1000,
      riskLevel: 'medium',
      estimatedReturn: 15,
      status: 'closed',
    });

    await expect(
      service.createSimulation(opportunityId, investorId, { investmentAmount: 5000 }),
    ).rejects.toThrow(BadRequestException);
    expect(simulationRepository.createSimulation).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when investment amount is less than minimum', async () => {
    const opportunityId = 'opportunity-1';
    const investorId = 'investor-1';
    const investmentAmount = 500;

    opportunitiesService.findOne.mockResolvedValue({
      opportunityId,
      title: 'Oportunidad A',
      businessName: 'Negocio A',
      category: 'Gastronomía',
      location: 'Ciudad',
      targetAmount: 10000,
      currentAmount: 2500,
      minAmount: 1000,
      riskLevel: 'medium',
      estimatedReturn: 15,
      status: 'available',
    });

    await expect(
      service.createSimulation(opportunityId, investorId, { investmentAmount }),
    ).rejects.toThrow(BadRequestException);
    expect(simulationRepository.createSimulation).not.toHaveBeenCalled();
  });

  it('should calculate estimated profit correctly', async () => {
    const opportunityId = 'opportunity-1';
    const investorId = 'investor-1';
    const investmentAmount = 10000;

    opportunitiesService.findOne.mockResolvedValue({
      opportunityId,
      title: 'Oportunidad A',
      businessName: 'Negocio A',
      category: 'Gastronomía',
      location: 'Ciudad',
      targetAmount: 50000,
      currentAmount: 5000,
      minAmount: 1000,
      riskLevel: 'medium',
      estimatedReturn: 20,
      status: 'available',
    });

    simulationRepository.createSimulation.mockResolvedValue({
      simulationId: 'simulation-2',
      opportunityId,
      investorId,
      investmentAmount,
      totalReturn: 12000,
      estimatedProfit: 2000,
      roiUsed: 20,
      riskLevel: 'medium',
      simulatedAt: new Date('2025-06-14'),
    });

    const result = await service.createSimulation(opportunityId, investorId, {
      investmentAmount,
    });

    expect(result.estimatedProfit).toBe(2000);
    expect(result.roiUsed).toBe(20);
  });
});
