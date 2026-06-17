import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { hash, compare } from 'bcryptjs';
import { AuthRepository } from './auth.repository';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async register(dto: RegisterAuthDto) {
    const existingUser = await this.authRepository.findByEmail(dto.email);

    if (existingUser) {
      throw new BadRequestException('El email ya está registrado');
    }

    const passwordHash = await hash(dto.password, 10);

    const user = await this.authRepository.createInvestorUser(dto, passwordHash);

    if (!user.investor) {
      throw new BadRequestException('No se pudo crear el perfil inversionista');
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      investorId: user.investor.id,
    };
  }

  async login(dto: LoginAuthDto) {
    const user = await this.authRepository.findByEmailWithInvestor(dto.email);

    if (!user || user.role !== 'investor') {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      investorId: user.investor?.id,
    };
  }
}
