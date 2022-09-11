import { Injectable, NestMiddleware } from '@nestjs/common';
import { UpdateBIO } from 'src/validators/profile';
@Injectable()
export class ProfileBioUpdateMiddleware implements NestMiddleware {
  async use(req: any, res: any, next: () => void) {
    try {
      await UpdateBIO.validateAsync(req.body);
      next();
    } catch (e) {
      res.statusCode = 400;
      return res.send({
        message: e.details[0].message,
      });
    }
  }
}
