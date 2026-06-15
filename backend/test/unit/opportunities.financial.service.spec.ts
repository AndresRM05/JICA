import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { OpportunitiesService } from '../../src/opportunities/opportunities.service';
import { OpportunitiesRepository } from '../../src/opportunities/opportunities.repository';

const mockOpportunitiesRepository = () => ({
  findAllAvailable: jest.fn(),
  findById: jest.fn(),
  findFinancialDetailById: jest.fn(),
});

describe('OpportunitiesService Financial Detail', () => {
  let service: OpportunitiesService;
  let repository: ReturnType<typeof mockOpportunitiesRepository>;

  beforeEach(async () => {
    repository = mockOpportunitiesRepository();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OpportunitiesService,
        {
          provide: OpportunitiesRepository,
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get<OpportunitiesService>(OpportunitiesService);
  });

  it('should return financial detail for available opportunity', async () => {
    repository.findFinancialDetailById.mockResolvedValue({
      opportunityId: 'opportunity-1',
      title: 'Oportunidad A',
      businessName: 'Negocio A',
      category: 'Gastronomía',
      location: 'Ciudad',
      description: 'Descripción',
      targetAmount: 10000,
      currentAmount: 2500,
      minAmount: 500,
      estimatedReturn: 0.15,
      riskLevel: 'medium',
      status: 'available',
      financialMetrics: [
        {
          month: '2025-01',
          revenue: 10000,
          grossMargin: 0.3,
          operatingMargin: 0.15,
          customerCount: 120,
          averageTicket: 80,
        },
      ],
      riskSummary: 'Nivel de riesgo medio',
    });

    const result = await service.getFinancialDetail('opportunity-1');

    expect(result.opportunityId).toBe('opportunity-1');
    expect(result.status).toBe('available');
    expect(result.financialMetrics).toHaveLength(1);
    expect(repository.findFinancialDetailById).toHaveBeenCalledWith('opportunity-1');
  });

  it('should throw NotFoundException when opportunity does not exist', async () => {
    repository.findFinancialDetailById.mockResolvedValue(null);

    await expect(service.getFinancialDetail('missing')).rejects.toThrow(NotFoundException);
  });

  it('should throw NotFoundException when opportunity is not available', async () => {
    repository.findFinancialDetailById.mockResolvedValue(null);

    await expect(service.getFinancialDetail('reserved-opportunity')).rejects.toThrow(NotFoundException);
  });
});
