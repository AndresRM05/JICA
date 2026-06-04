// /backend/src/auth/strategies/jwt.strategy.ts
import { PassportStrategy } from '@nestjs/passport';
import { BearerStrategy } from 'passport-azure-ad';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
 
@Injectable()
export class JwtStrategy extends PassportStrategy(BearerStrategy, 'azure-ad') {
  constructor(private configService: ConfigService) {
    super({
      identityMetadata: `https://login.microsoftonline.com/${configService.get('AZURE_TENANT_ID')}/v2.0/.well-known/openid-configuration`,
      clientID: configService.get('AZURE_CLIENT_ID'),
      audience: configService.get('AZURE_CLIENT_ID'),
      validateIssuer: true,
      loggingLevel: 'warn',
    });
  }
 
  validate(payload: any) {
    if (!payload) throw new UnauthorizedException();
    return {
      id: payload.oid,
      email: payload.preferred_username,
      roles: payload.roles ?? [],
    };
  }
}