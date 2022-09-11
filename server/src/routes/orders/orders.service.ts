import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Orders, User } from '@prisma/client';
import axios from 'axios';
import { WEBHOOK_URL } from 'src/constants';
import { prisma } from 'src/lib/db';

@Injectable()
export class OrdersService {
  async fetchOrders(userId: string) {
    const received = await prisma.orders.findMany({
      where: {
        sellerId: userId,
      },
      select: {
        id: true,
        createdAt: true,
        status: true,
      },
    });
    const created = await prisma.orders.findMany({
      where: {
        buyerId: userId,
      },
      select: {
        id: true,
        createdAt: true,
        status: true,
      },
    });
    return { received, created };
  }
  async fetchOrderDetails(
    userId: string,
    orderId: string,
    type: 'seller' | 'buyer',
  ) {
    let orderDetails: Partial<Orders>;
    if (type === 'buyer') {
      orderDetails = await prisma.orders.findFirst({
        where: {
          buyerId: userId,
          id: orderId,
        },
        select: {
          createdAt: true,
          price: true,
          status: true,
          sellerId: true,
          buyerId: true,
        },
      });
    } else {
      orderDetails = await prisma.orders.findFirst({
        where: {
          sellerId: userId,
          id: orderId,
        },
        select: {
          createdAt: true,
          price: true,
          status: true,
          sellerId: true,
          buyerId: true,
        },
      });
    }
    if (!orderDetails)
      throw new NotFoundException(
        undefined,
        'No Order Found With Supplied Values.',
      );
    let secondParty: Partial<User>;
    if (type === 'buyer') {
      secondParty = await prisma.user.findFirst({
        where: {
          id: orderDetails.sellerId,
        },
        select: {
          name: true,
          username: true,
          profileURL: true,
        },
      });
    } else {
      secondParty = await prisma.user.findFirst({
        where: {
          id: orderDetails.buyerId,
        },
        select: {
          name: true,
          username: true,
          profileURL: true,
        },
      });
    }
    return { order: orderDetails, secondParty };
  }

  async markOrderAsDone(userId: string, chatId: string) {
    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        OR: [
          {
            buyerId: {
              equals: userId,
            },
          },
          {
            sellerId: {
              equals: userId,
            },
          },
        ],
      },
      select: {
        Orders: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    });

    if (!chat)
      throw new UnauthorizedException(
        undefined,
        "You're not allowed to perform this action.",
      );
    if (chat.Orders[0].status === 'complete')
      throw new BadRequestException(
        undefined,
        'This Order is Already Marked as Done.',
      );
    await prisma.chat.update({
      data: {
        Orders: {
          update: {
            data: {
              status: 'complete',
            },
            where: {
              id: chat.Orders[0].id,
            },
          },
        },
      },
      where: {
        id: chatId,
      },
    });
    axios.post(WEBHOOK_URL, {
      content: 'Order Marked As Completed',
      username: 'Lend My Skill',
      embeds: [
        {
          title: 'New Order Marked As Completed',
          fields: [
            {
              name: 'Chat Id',
              value: chatId,
            },
          ],
          color: 2023659,
        },
      ],
    });
  }
}
