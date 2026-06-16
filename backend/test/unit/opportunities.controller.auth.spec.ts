import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { OpportunitiesController } from '../../src/opportunities/opportunities.controller';
import { OpportunitiesService } from '../../src/opportunities/opportunities.service';
import { InvestorGuard } from '../../src/auth/guards/investor.guard';

const mockOpportunitiesService = () => ({
  findAll: jest.fn(),
  findOne: jest.fn(),
});

const mockExecutionContext = (user: any): Partial<ExecutionContext> => ({
  switchToHttp: () => ({
    getRequest: () => ({ user }),
  }),
} as Partial<ExecutionContext>);

describe('OpportunitiesController Auth Guards', () => {
  let service: ReturnType<typeof mockOpportunitiesService>;
  let controller: OpportunitiesController;
  let investorGuard: InvestorGuard;

  beforeEach(async () => {
    service = mockOpportunitiesService();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OpportunitiesController],
      providers: [
        {
          provide: OpportunitiesService,
          useValue: service,
        },
        InvestorGuard,
      ],
    }).compile();

    controller = module.get<OpportunitiesController>(OpportunitiesController);
    investorGuard = module.get<InvestorGuard>(InvestorGuard);
  });

  it('should allow investor user in investor guard', () => {
    const context = mockExecutionContext({ roles: ['investor'] });
    expect(investorGuard.canActivate(context as ExecutionContext)).toBe(true);
  });

  it('should attach demo investor user when no authenticated user exists in MVP mode', () => {
    const request = { user: null };
    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as Partial<ExecutionContext>;

    expect(investorGuard.canActivate(context as ExecutionContext)).toBe(true);
    expect(request.user).toEqual(expect.objectContaining({ roles: ['investor'] }));
  });

  it('should throw ForbiddenException when user is not investor', () => {
    const context = mockExecutionContext({ roles: ['business'] });
    expect(() => investorGuard.canActivate(context as ExecutionContext)).toThrow(ForbiddenException);
  });
});
