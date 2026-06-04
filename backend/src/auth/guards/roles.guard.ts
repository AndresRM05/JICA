// /backend/src/auth/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../auth.types';
 
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
 
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<UserRole[]>('roles', context.getHandler());
    if (!requiredRoles) return true;
 
    const { user } = context.switchToHttp().getRequest();
    const hasRole = requiredRoles.some((role) => user?.roles?.includes(role));
 
    if (!hasRole) throw new ForbiddenException('No tienes permiso para realizar esta acción');
    return true;
  }
}