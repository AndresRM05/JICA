import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { OpportunitiesService } from '../../src/opportunities/opportunities.service';
import { OpportunitiesRepository } from '../../src/opportunities/opportunities.repository';

const mockOpportunitiesRepository = () => ({
  findAllAvailable: jest.fn(),
  findById: jest.fn(),
});

describe('OpportunitiesService', () => {
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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return available opportunities', async () => {
    repository.findAllAvailable.mockResolvedValue([
      {
        opportunityId: 'opportunity-1',
        title: 'Oportunidad A',
        businessName: 'Negocio A',
        category: 'Gastronomía',
        location: 'Ciudad',
        targetAmount: 10000,
        currentAmount: 2000,
        minAmount: 500,
        riskLevel: 'medium',
        estimatedReturn: 0.15,
        status: 'available',
      },
    ]);

    const result = await service.findAll();

    expect(result).toHaveLength(1);
    expect(repository.findAllAvailable).toHaveBeenCalled();
    expect(result[0]).toEqual(expect.objectContaining({ status: 'available' }));
  });

  it('findOne should return opportunity when it exists', async () => {
    repository.findById.mockResolvedValue({
      opportunityId: 'opportunity-1',
      title: 'Oportunidad A',
      businessName: 'Negocio A',
      category: 'Gastronomía',
      location: 'Ciudad',
      targetAmount: 10000,
      currentAmount: 2000,
      minAmount: 500,
      riskLevel: 'medium',
      estimatedReturn: 0.15,
      status: 'available',
    });

    const result = await service.findOne('opportunity-1');

    expect(result).toEqual(expect.objectContaining({ opportunityId: 'opportunity-1' }));
  });

  it('findOne should throw NotFoundException when not found', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(service.findOne('missing')).rejects.toThrow(NotFoundException);
  });
});
