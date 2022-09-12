import {
  Controller,
  Headers,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { TokenExpiredError, verify, JsonWebTokenError } from 'jsonwebtoken';
import { JWT_SECRET } from 'src/constants';
import { BaseGuard } from 'src/guards/base.guard';

@Controller('jwt')
export class JwtController {
  @Post('/')
  async verifyJWTOfUser(@Headers('authorization') auth: string) {
    const message = await this.verifyJWT(auth);
    if (message === null) {
      throw new UnauthorizedException(undefined, '');
    }
    if (message === true) {
      return {};
    }
    throw new UnauthorizedException(undefined, message as string);
  }
  async verifyJWT(jwt: string): Promise<null | string | boolean> {
    try {
      await verify(jwt, JWT_SECRET);
      return true;
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        return 'Your Authentication Token Expired, Sign In Again to Generate A New One.';
      }
      return 'We Cannot Verify Your Authentication Token, Please Sign In Again to Generate A New One.';
    }
  }
}
