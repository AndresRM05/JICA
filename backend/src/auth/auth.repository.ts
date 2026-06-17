import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterAuthDto } from './dto/register-auth.dto';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findByEmailWithInvestor(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: { investor: true },
    });
  }

  async createInvestorUser(dto: RegisterAuthDto, passwordHash: string) {
    return this.prisma.user.create({
      data: {
        email: dto.email,
        password: passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        role: 'investor',
        investor: {
          create: {
            phone: dto.phone,
          },
        },
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        investor: {
          select: {
            id: true,
          },
        },
      },
    });
  }
}
