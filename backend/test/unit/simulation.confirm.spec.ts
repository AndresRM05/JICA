import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { SimulationService } from '../../src/simulation/simulation.service';
import { SimulationRepository } from '../../src/simulation/simulation.repository';
import { OpportunitiesService } from '../../src/opportunities/opportunities.service';
import { InvestmentIntentRepository } from '../../src/simulation/investment-intent.repository';

const mockSimulationRepository = () => ({
  findById: jest.fn(),
});

const mockOpportunitiesService = () => ({
  findOne: jest.fn(),
});

const mockInvestmentIntentRepository = () => ({
  findBySimulationId: jest.fn(),
  createIntent: jest.fn(),
});

describe('SimulationService.confirmSimulation', () => {
  let service: SimulationService;
  let simulationRepository: ReturnType<typeof mockSimulationRepository>;
  let opportunitiesService: ReturnType<typeof mockOpportunitiesService>;
  let investmentIntentRepository: ReturnType<typeof mockInvestmentIntentRepository>;

  beforeEach(async () => {
    simulationRepository = mockSimulationRepository();
    opportunitiesService = mockOpportunitiesService();
    investmentIntentRepository = mockInvestmentIntentRepository();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SimulationService,
        { provide: SimulationRepository, useValue: simulationRepository },
        { provide: OpportunitiesService, useValue: opportunitiesService },
        { provide: InvestmentIntentRepository, useValue: investmentIntentRepository },
      ],
    }).compile();

    service = module.get<SimulationService>(SimulationService);
  });

  it('should confirm a valid simulation', async () => {
    const simulationId = 'sim-1';
    const investorId = 'inv-1';

    simulationRepository.findById.mockResolvedValue({
      simulationId,
      investorId,
      opportunityId: 'opp-1',
      amount: 5000,
      estimatedReturn: 15,
      riskLevel: 'medium',
      simulatedAt: new Date('2025-06-14'),
    });

    opportunitiesService.findOne.mockResolvedValue({
      opportunityId: 'opp-1',
      status: 'available',
      minAmount: 1000,
      estimatedReturn: 15,
    });

    investmentIntentRepository.findBySimulationId.mockResolvedValue(null);

    investmentIntentRepository.createIntent.mockResolvedValue({
      id: 'intent-1',
      investorId,
      opportunityId: 'opp-1',
      simulationId,
      amount: 5000,
      expectedReturn: 5750,
      status: 'confirmed',
      confirmedAt: new Date('2025-06-15'),
    });

    const result = await service.confirmSimulation(simulationId, investorId);

    expect(result.intentId).toBe('intent-1');
    expect(result.status).toBe('confirmed');
    expect(investmentIntentRepository.createIntent).toHaveBeenCalled();
  });

  it('throws NotFound if simulation missing', async () => {
    simulationRepository.findById.mockResolvedValue(null);
    await expect(service.confirmSimulation('missing', 'inv-1')).rejects.toThrow(NotFoundException);
  });

  it('throws BadRequest if simulation does not belong to user', async () => {
    simulationRepository.findById.mockResolvedValue({ simulationId: 's1', investorId: 'other', opportunityId: 'opp-1', amount: 1000, estimatedReturn: 10, riskLevel: 'low', simulatedAt: new Date() });
    await expect(service.confirmSimulation('s1', 'inv-1')).rejects.toThrow(BadRequestException);
  });

  it('throws BadRequest if opportunity not available', async () => {
    simulationRepository.findById.mockResolvedValue({ simulationId: 's1', investorId: 'inv-1', opportunityId: 'opp-1', amount: 1000, estimatedReturn: 10, riskLevel: 'low', simulatedAt: new Date() });
    opportunitiesService.findOne.mockResolvedValue({ opportunityId: 'opp-1', status: 'closed' });
    await expect(service.confirmSimulation('s1', 'inv-1')).rejects.toThrow(BadRequestException);
  });

  it('throws BadRequest if existing confirmed intent', async () => {
    simulationRepository.findById.mockResolvedValue({ simulationId: 's1', investorId: 'inv-1', opportunityId: 'opp-1', amount: 1000, estimatedReturn: 10, riskLevel: 'low', simulatedAt: new Date() });
    opportunitiesService.findOne.mockResolvedValue({ opportunityId: 'opp-1', status: 'available' });
    investmentIntentRepository.findBySimulationId.mockResolvedValue({ id: 'i1', status: 'confirmed' });
    await expect(service.confirmSimulation('s1', 'inv-1')).rejects.toThrow(BadRequestException);
  });
});
