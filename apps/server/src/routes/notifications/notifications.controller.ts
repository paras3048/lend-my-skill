import {
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BaseGuard } from 'src/guards/base.guard';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
@UseGuards(BaseGuard)
export class NotificationsController {
  constructor(protected readonly service: NotificationsService) {}

  @Get(':userId')
  async fetchNotifications(
    @Param('userId') id: string,
    @Query('skip') skip: string,
    @Query('take') take: string,
  ) {
    return await this.service.fetchUserNotificationsById({
      id,
      skip: skip ? parseInt(skip) : undefined,
      take: take ? parseInt(take) : undefined,
    });
  }
  @Patch(':id')
  async updateNotificationSeenStatus(@Param('id') id: string) {
    await this.service.updateNotificationStatus(id);
    return undefined;
  }
}
