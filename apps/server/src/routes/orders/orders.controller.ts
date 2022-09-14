import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { BaseGuard } from 'src/guards/base.guard';
import { verifyJWT } from 'src/helpers/jwt';
import { OrdersService } from './orders.service';

@Controller('orders')
@UseGuards(BaseGuard)
export class OrdersController {
  constructor(protected readonly service: OrdersService) {}

  @Get('/created')
  async fetchOrdersCreated(@Headers('Authorization') auth: string) {
    const userId = verifyJWT(auth)!;
    const { created } = await this.service.fetchOrders(userId);
    return created;
  }
  @Get('/received')
  async fetchOrdersReceived(@Headers('Authorization') auth: string) {
    const userId = verifyJWT(auth)!;
    const { received } = await this.service.fetchOrders(userId);
    return received;
  }
  @Get('/:type/:id')
  async fetchOrderDetail(
    @Param('id') id: string,
    @Headers('authorization') auth: string,
    @Param('type') type: 'seller' | 'buyer',
  ) {
    const userId = verifyJWT(auth)!;
    return this.service.fetchOrderDetails(userId, id, type);
  }
  @Patch('/complete')
  async markOrderAsComplete(
    @Body()
    body: {
      chatId: string;
    },
    @Headers('authorization') auth: string,
  ) {
    const userId = verifyJWT(auth);
    if (!body.chatId)
      throw new BadRequestException(undefined, 'Please Provide ChatId');
    await this.service.markOrderAsDone(userId, body.chatId);
    return {};
  }
}
