import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';

@Injectable()
export class InvestorGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('No estás autenticado');
    }

    if (!Array.isArray(user.roles) || !user.roles.includes('investor')) {
      throw new ForbiddenException('No tienes permiso para acceder a oportunidades de inversión');
    }

    return true;
  }
}
