import {
  Body,
  Controller,
  Headers,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import axios from 'axios';
import { WEBHOOK_URL } from 'src/constants';
import { BaseGuard } from 'src/guards/base.guard';
import { verifyJWT } from 'src/helpers/jwt';
import { prisma } from 'src/lib/db';
@Controller('error')
@UseGuards(BaseGuard)
export class ErrorController {
  @Post('/')
  async reportError(
    @Body() body: { message: string },
    @Headers('authorization') auth: string,
  ) {
    const userId = verifyJWT(auth);
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        username: true,
      },
    });
    if (!user)
      throw new UnauthorizedException(
        undefined,
        "You're not allowed to perform this action.",
      );
    // axios.post(WEBHOOK_URL,{

    // })
  }
}
