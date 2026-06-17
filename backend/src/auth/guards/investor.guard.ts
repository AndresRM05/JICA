import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import type { AuthenticatedInvestorRequest } from '../auth.types';

@Injectable()
export class InvestorGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedInvestorRequest>();
    const investorIdHeader = request.headers['x-investor-id'];
    const investorId = Array.isArray(investorIdHeader) ? investorIdHeader[0] : investorIdHeader;

    if (!investorId) {
      throw new UnauthorizedException('Se requiere x-investor-id para el MVP local');
    }

    request.user = {
      id: investorId,
      email: '',
      role: 'investor',
      roles: ['investor'],
      investorId,
    };

    return true;
  }
}
