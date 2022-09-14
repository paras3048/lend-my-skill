import {
  Controller,
  Get,
  Headers,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BaseGuard } from 'src/guards/base.guard';
import { verifyJWT } from 'src/helpers/jwt';
import { MessagesService } from './messages.service';

@Controller('messages')
@UseGuards(BaseGuard)
export class MessagesController {
  constructor(protected readonly service: MessagesService) {}
  @Get(':chatId/:type')
  async fetchMessages(
    @Param('chatId') chatId: string,
    @Param('type') type: string,
    @Query('skip') skip: string,
    @Query('take') take: string,
    @Headers('authorization') auth: string,
  ) {
    const userId = await verifyJWT(auth);

    return await this.service.fetchChats(
      userId,
      type,
      chatId,
      parseInt(skip || '0'),
      parseInt(take || '20'),
    );
  }
}
