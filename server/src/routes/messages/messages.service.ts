import { Injectable } from '@nestjs/common';
import { prisma } from 'src/lib/db';

@Injectable()
export class MessagesService {
  async fetchChats(
    userId: string,
    type: string,
    chatId: string,
    skip?: number,
    take?: number,
  ) {
    let messages;
    let count: number;
    if (type === 'buyer') {
      messages = await prisma.message.findMany({
        where: {
          chatId: chatId,
          Chat: {
            buyerId: userId,
          },
        },
        select: {
          bySystem: true,
          content: true,
          createdAt: true,
          sender: {
            select: {
              username: true,
              profileURL: true,
            },
          },
          type: true,
          id: true,
        },
        skip: skip || 0,
        take: take || 30,
        orderBy: {
          createdAt: 'asc',
        },
      });
      count = await prisma.message.count({
        where: {
          Chat: {
            id: chatId,
            buyerId: userId,
          },
        },
      });
    } else if (type === 'seller') {
      messages = await prisma.message.findMany({
        where: {
          chatId: chatId,
          Chat: {
            sellerId: userId,
          },
        },
        select: {
          bySystem: true,
          content: true,
          createdAt: true,
          sender: {
            select: {
              username: true,
              profileURL: true,
            },
          },
          type: true,
          id: true,
        },
        skip: skip || 0,
        take: take || 30,
        orderBy: {
          createdAt: 'asc',
        },
      });
      count = await prisma.message.count({
        where: {
          Chat: {
            id: chatId,
            sellerId: userId,
          },
        },
      });
    }
    return { messages, count };
  }
}
