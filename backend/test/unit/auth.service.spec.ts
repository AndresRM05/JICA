import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../src/auth/auth.service';
import { AuthRepository } from '../../src/auth/auth.repository';
import { hash } from 'bcryptjs';

const mockAuthRepository = () => ({
  findByEmail: jest.fn(),
  findByEmailWithInvestor: jest.fn(),
  createInvestorUser: jest.fn(),
});

describe('AuthService', () => {
  let service: AuthService;
  let authRepository: ReturnType<typeof mockAuthRepository>;

  beforeEach(async () => {
    authRepository = mockAuthRepository();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: AuthRepository,
          useValue: authRepository,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should register investor successfully', async () => {
    authRepository.findByEmail.mockResolvedValue(null);
    authRepository.createInvestorUser.mockResolvedValue({
      id: 'user-1',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      role: 'investor',
    });

    const result = await service.register({
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
    });

    expect(result).toEqual(expect.objectContaining({
      id: 'user-1',
      email: 'test@example.com',
      role: 'investor',
    }));
  });

  it('should throw BadRequestException when email already exists', async () => {
    authRepository.findByEmail.mockResolvedValue({ id: 'user-1', email: 'test@example.com' });

    await expect(
      service.register({
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should login successfully with correct credentials', async () => {
    const hashedPassword = await hash('password123', 10);
    authRepository.findByEmailWithInvestor.mockResolvedValue({
      id: 'user-1',
      email: 'test@example.com',
      password: hashedPassword,
      firstName: 'Test',
      lastName: 'User',
      role: 'investor',
      investor: { id: 'investor-1' },
    });

    const result = await service.login({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(result).toEqual(expect.objectContaining({
      id: 'user-1',
      email: 'test@example.com',
      role: 'investor',
      investorId: 'investor-1',
    }));
    expect(result).not.toHaveProperty('password');
  });

  it('should throw UnauthorizedException on invalid credentials', async () => {
    authRepository.findByEmailWithInvestor.mockResolvedValue(null);

    await expect(
      service.login({
        email: 'wrong@example.com',
        password: 'password123',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
