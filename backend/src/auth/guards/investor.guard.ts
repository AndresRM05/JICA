import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

const demoInvestorUser = {
  id: '11111111-1111-4111-8111-111111111111',
  email: 'demo@jica.local',
  role: 'investor',
  roles: ['investor'],
  investorId: '22222222-2222-4222-8222-222222222222',
};

@Injectable()
export class InvestorGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    if (!request.user) {
      request.user = demoInvestorUser;
    }

    const roles = request.user.roles ?? [request.user.role];
    if (!Array.isArray(roles) || !roles.includes('investor')) {
      throw new ForbiddenException('No tienes permiso para acceder a oportunidades de inversión');
    }

    return true;
  }
}
