import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { IncomingMessage } from 'http';
import { verifyJWT } from 'src/helpers/jwt';
import { prisma } from 'src/lib/db';

@Injectable()
export class BaseGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
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

    const user = await prisma.user.findFirst({
      where: {
        id: decodedJWT,
      },
      select: {
        banned: true,
        reasonForBan: true,
      },
    });
    if (!user)
      throw new ForbiddenException(
        undefined,
        "You're not allowed to perform this action.",
      );
    if (user.banned)
      throw new ForbiddenException(
        undefined,
        `You've been Banned From Using This Platform. Reason: ${user.reasonForBan}`,
      );

    return true;
  }
}
