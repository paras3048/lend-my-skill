import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { IncomingMessage } from 'http';
import { UserSignupParams } from '../validators/auth';

@Injectable()
export class UserSignupGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    return true;
  }
}
