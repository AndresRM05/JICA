import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
 
@Injectable()
export class EntraIdGuard extends AuthGuard('azure-ad') {}