import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { IncomingMessage } from 'http';
import { verifyJWT } from 'src/helpers/jwt';

@Injectable()
export class BaseGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const data = context.switchToHttp().getRequest<IncomingMessage>();

    if (data.headers.authorization === undefined) {
      throw new UnauthorizedException(
        undefined,
        'No Valid Authentication Header Provided.',
      );
    }
    const decodedJWT = verifyJWT(data.headers.authorization);

    if (decodedJWT === null)
      throw new ForbiddenException(
        undefined,
        'Invalid Authentication Token Provided.',
      );
    return true;
  }
}
