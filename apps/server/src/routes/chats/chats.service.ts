import { BadRequestException, Injectable } from '@nestjs/common';
import { Chat } from '@prisma/client';
import { prisma } from 'src/lib/db';

@Injectable()
export class ChatsService {
  async fetchAllChats(userId: string, type: 'buyer' | 'seller') {
    let allChats: any[];
    const allChatz: any[] = [];
    if (type === 'buyer') {
      allChats = await prisma.chat.findMany({
        where: {
          buyerId: userId,
          Orders: {
            some: {
              status: 'incomplete',
            },
          },
        },
        select: {
          id: true,
          openedAt: true,
          messages: {
            take: 1,
            select: {
              createdAt: true,
              sender: {
                select: {
                  username: true,
                  profileURL: true,
                },
              },
              id: true,
              content: true,
            },
            orderBy: {
              createdAt: 'desc',
            },
          },
          sellerId: true,
        },
      });
      for await (const chat of allChats) {
        const userId = chat.buyerId;
        const secondParty = await prisma.user.findFirst({
          where: {
            id: userId,
          },
          select: {
            username: true,
            profileURL: true,
          },
        });
        allChatz.push({ ...chat, secondParty });
      }
    } else if (type === 'seller') {
      allChats = await prisma.chat.findMany({
        where: {
          sellerId: userId,
          Orders: {
            some: {
              status: 'incomplete',
            },
          },
        },
        select: {
          id: true,
          openedAt: true,
          messages: {
            take: 1,
            select: {
              createdAt: true,
              sender: {
                select: {
                  username: true,
                  profileURL: true,
                },
              },
              content: true,
              id: true,
            },
            orderBy: {
              createdAt: 'desc',
            },
          },
          sellerId: true,
          buyerId: true,
        },
      });

      for await (const chat of allChats) {
        const userId = chat.buyerId;
        const secondParty = await prisma.user.findFirst({
          where: {
            id: userId,
          },
          select: {
            username: true,
            profileURL: true,
          },
        });
        allChatz.push({ ...chat, secondParty });
      }
    } else throw new BadRequestException(undefined, 'Invalid User Type');
    return allChatz;
  }
}
