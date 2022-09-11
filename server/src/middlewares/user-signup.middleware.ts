import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserSignupParams } from '../validators/auth';
@Injectable()
export class UserSignupMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: () => void) {
    try {
      await UserSignupParams.validateAsync(req.body);
      next();
    } catch (e) {
      res.statusCode = 400;
      return res.send({
        message: e.details[0].message,
      });
    }
  }
}
