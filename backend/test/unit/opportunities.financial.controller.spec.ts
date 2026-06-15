import { Test, TestingModule } from '@nestjs/testing';
import { OpportunitiesFinancialController } from '../../src/opportunities/opportunities.financial.controller';
import { OpportunitiesService } from '../../src/opportunities/opportunities.service';

const mockOpportunitiesService = () => ({
  getFinancialDetail: jest.fn(),
});

describe('OpportunitiesFinancialController', () => {
  let controller: OpportunitiesFinancialController;
  let service: ReturnType<typeof mockOpportunitiesService>;

  beforeEach(async () => {
    service = mockOpportunitiesService();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OpportunitiesFinancialController],
      providers: [
        {
          provide: OpportunitiesService,
          useValue: service,
        },
      ],
    }).compile();

    controller = module.get<OpportunitiesFinancialController>(OpportunitiesFinancialController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('getFinancialDetail should return the financial detail', async () => {
    const mockDetail = { opportunityId: 'opportunity-1' };
    service.getFinancialDetail.mockResolvedValue(mockDetail);

    const result = await controller.getFinancialDetail('opportunity-1');

    expect(result).toEqual(mockDetail);
    expect(service.getFinancialDetail).toHaveBeenCalledWith('opportunity-1');
  });
});
