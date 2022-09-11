import { Injectable, NestMiddleware } from '@nestjs/common';
import { UserLoginParams } from 'src/validators/auth';

@Injectable()
export class UserLoginMiddleware implements NestMiddleware {
  async use(req: any, res: any, next: () => void) {
    try {
      await UserLoginParams.validateAsync(req.body);
      next();
    } catch (e) {
      res.statusCode = 400;
      return res.send({
        message: e.details[0].message,
      });
    }
  }
}
