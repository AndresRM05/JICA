import { Test, TestingModule } from '@nestjs/testing';
import { SimulationController } from '../../src/simulation/simulation.controller';
import { SimulationService } from '../../src/simulation/simulation.service';

const mockSimulationService = () => ({
  createSimulation: jest.fn(),
});

describe('SimulationController', () => {
  let controller: SimulationController;
  let service: ReturnType<typeof mockSimulationService>;

  beforeEach(async () => {
    service = mockSimulationService();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SimulationController],
      providers: [
        {
          provide: SimulationService,
          useValue: service,
        },
      ],
    }).compile();

    controller = module.get<SimulationController>(SimulationController);
  });

  it('should create a simulation', async () => {
    const opportunityId = 'opportunity-1';
    const investorId = 'investor-1';
    const createSimulationDto = { investmentAmount: 5000 };

    service.createSimulation.mockResolvedValue({
      simulationId: 'simulation-1',
      opportunityId,
      investorId,
      investmentAmount: 5000,
      totalReturn: 5750,
      estimatedProfit: 750,
      roiUsed: 15,
      riskLevel: 'medium',
      simulatedAt: new Date('2025-06-14'),
    });

    const mockRequest = { user: { investorId } };

    const result = await controller.createSimulation(
      opportunityId,
      createSimulationDto,
      mockRequest,
    );

    expect(result.simulationId).toBe('simulation-1');
    expect(result.investmentAmount).toBe(5000);
    expect(service.createSimulation).toHaveBeenCalledWith(
      opportunityId,
      investorId,
      createSimulationDto,
    );
  });

  it('should extract investorId from request.user', async () => {
    const opportunityId = 'opportunity-1';
    const investorId = 'investor-123';
    const createSimulationDto = { investmentAmount: 5000 };

    service.createSimulation.mockResolvedValue({
      simulationId: 'simulation-1',
      opportunityId,
      investorId,
      investmentAmount: 5000,
      totalReturn: 5750,
      estimatedProfit: 750,
      roiUsed: 15,
      riskLevel: 'medium',
      simulatedAt: new Date('2025-06-14'),
    });

    const mockRequest = { user: { investorId } };

    await controller.createSimulation(opportunityId, createSimulationDto, mockRequest);

    expect(service.createSimulation).toHaveBeenCalledWith(
      opportunityId,
      investorId,
      createSimulationDto,
    );
  });
});
