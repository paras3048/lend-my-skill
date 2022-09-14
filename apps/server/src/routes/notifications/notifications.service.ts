import { Injectable } from '@nestjs/common';
import { prisma } from 'src/lib/db';

interface NotificationFetchingProps {
  id: string;
  skip?: number;
  take?: number;
}

@Injectable()
export class NotificationsService {
  async fetchUserNotificationsById(props: NotificationFetchingProps) {
    const notifications = await prisma.notifications.findMany({
      where: {
        User: {
          id: props.id,
        },
        seen: false,
      },
      skip: props.skip || 0,
      take: props.take || 30,
      select: {
        name: true,
        createdAt: true,
        description: true,
        id: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return notifications;
  }
  async updateNotificationStatus(id: string) {
    await prisma.notifications.update({
      where: {
        id,
      },
      data: {
        seen: true,
      },
    });
    return undefined;
  }
}
