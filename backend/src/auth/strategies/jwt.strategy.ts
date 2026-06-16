import { Injectable, UnauthorizedException } from '@nestjs/common';
import type { UserRole } from '../auth.types';

/**
 * Estrategia simplificada para el MVP.
 *
 * La integración real con Microsoft Entra ID queda desacoplada para que la demo
 * pueda ejecutarse sin tenant, client id ni dependencias externas de Passport.
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
