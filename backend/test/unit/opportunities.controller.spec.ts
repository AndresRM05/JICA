import { Test, TestingModule } from '@nestjs/testing';
import { OpportunitiesController } from '../../src/opportunities/opportunities.controller';
import { OpportunitiesService } from '../../src/opportunities/opportunities.service';

const mockOpportunitiesService = () => ({
  findAll: jest.fn(),
  findOne: jest.fn(),
});

describe('OpportunitiesController', () => {
  let controller: OpportunitiesController;
  let service: ReturnType<typeof mockOpportunitiesService>;

  beforeEach(async () => {
    service = mockOpportunitiesService();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OpportunitiesController],
      providers: [
        {
          provide: OpportunitiesService,
          useValue: service,
        },
      ],
    }).compile();

    controller = module.get<OpportunitiesController>(OpportunitiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAll should return a list of opportunities', async () => {
    service.findAll.mockResolvedValue([{ opportunityId: 'opportunity-1' }]);

    const result = await controller.findAll();

    expect(result).toEqual([{ opportunityId: 'opportunity-1' }]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('findOne should return one opportunity', async () => {
    service.findOne.mockResolvedValue({ opportunityId: 'opportunity-1' });

    const result = await controller.findOne('opportunity-1');

    expect(result).toEqual({ opportunityId: 'opportunity-1' });
    expect(service.findOne).toHaveBeenCalledWith('opportunity-1');
  });
});
