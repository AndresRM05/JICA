import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

const demoUser = {
  id: '11111111-1111-4111-8111-111111111111',
  email: 'demo@jica.local',
  role: 'investor',
  roles: ['investor'],
  investorId: '22222222-2222-4222-8222-222222222222',
};

@Injectable()
export class EntraIdGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    if (!request.user) {
      request.user = demoUser;
    }

    return true;
  }
}
