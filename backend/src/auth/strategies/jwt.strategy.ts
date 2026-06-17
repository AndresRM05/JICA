import { Injectable, UnauthorizedException } from '@nestjs/common';
import type { UserRole } from '../auth.types';

/**
 * Estrategia simplificada y no obligatoria para el MVP local.
 */
interface JwtPayload {
  oid?: string;
  id?: string;
  preferred_username?: string;
  email?: string;
  roles?: UserRole[];
  investorId?: string;
}

@Injectable()
export class JwtStrategy {
  validate(payload: JwtPayload | null | undefined) {
    if (!payload) throw new UnauthorizedException();

    return {
      id: payload.oid ?? payload.id,
      email: payload.preferred_username ?? payload.email,
      roles: payload.roles ?? ['investor'],
      investorId: payload.investorId,
    };
  }
}
