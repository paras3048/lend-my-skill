import { Body, Controller, Get, Headers, Post, UseGuards } from '@nestjs/common';
import { BaseGuard } from 'src/guards/base.guard';
import { verifyJWT } from 'src/helpers/jwt';
import { ChatsService } from './chats.service';

@Controller('chats')
@UseGuards(BaseGuard)
export class ChatsController {
  constructor(protected readonly service: ChatsService) {}
  @Post('/')
  async fetchUserChats(
    @Headers('authorization') auth: string,
    @Body() body: { type: 'seller' | 'buyer' },
  ) {
    const id = await verifyJWT(auth)!;
    return await this.service.fetchAllChats(id, body.type);
  }
}
