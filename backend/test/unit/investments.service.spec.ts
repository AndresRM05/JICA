import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { InvestmentsService } from '../../src/investments/investments.service';
import { InvestmentsRepository } from '../../src/investments/investments.repository';

const mockInvestmentsRepository = () => ({
  findById: jest.fn(),
  registerInterest: jest.fn(),
});

describe('InvestmentsService', () => {
  let service: InvestmentsService;
  let repository: ReturnType<typeof mockInvestmentsRepository>;

  beforeEach(async () => {
    repository = mockInvestmentsRepository();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvestmentsService,
        {
          provide: InvestmentsRepository,
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get<InvestmentsService>(InvestmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findOne should return opportunity when available', async () => {
    repository.findById.mockResolvedValue({
      id: 'opportunity-1',
      businessName: 'Prueba',
      estimatedReturn: 0.15,
      riskLevel: 'medium',
      minAmount: 1000,
      status: 'available',
    });

    const result = await service.findOne('opportunity-1');

    expect(result).toEqual(expect.objectContaining({ id: 'opportunity-1' }));
  });

  it('findOne should throw NotFoundException when not found', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(service.findOne('missing')).rejects.toThrow(NotFoundException);
  });

  it('registerInterest should call repository when opportunity is available', async () => {
    repository.findById.mockResolvedValue({
      id: 'opportunity-1',
      businessName: 'Prueba',
      estimatedReturn: 0.15,
      riskLevel: 'medium',
      minAmount: 1000,
      status: 'available',
    });

    await service.registerInterest('opportunity-1', 'investor-1');

    expect(repository.registerInterest).toHaveBeenCalledWith('opportunity-1', 'investor-1');
  });

  it('registerInterest should throw BadRequestException when opportunity is not available', async () => {
    repository.findById.mockResolvedValue({
      id: 'opportunity-1',
      businessName: 'Prueba',
      estimatedReturn: 0.15,
      riskLevel: 'medium',
      minAmount: 1000,
      status: 'reserved',
    });

    await expect(service.registerInterest('opportunity-1', 'investor-1')).rejects.toThrow(BadRequestException);
  });
});
