import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WsException,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { verifyConnectPayload } from 'src/helpers/socket';
import { MessageVariants } from '@prisma/client';
import { prisma } from 'src/lib/db';
import axios from 'axios';

@WebSocketGateway()
export class MessagesGateway implements OnGatewayConnection {
  async handleConnection(client: Socket, ...args: any[]) {
    const res = await verifyConnectPayload({
      auth: client.handshake.auth,
    });
    if (res === false) throw new WsException('Invalid Auth Payload');
    if (!client.handshake.query.chatId)
      throw new WsException('No ChatId Provided');

    client.join(`channel_${client.handshake.query.chatId}`);
  }
  @SubscribeMessage('MESSAGE_CREATE')
  async messageCreate(
    client: Socket,
    payload: {
      chatId: string;
      userId: string;
      content: string;
      type: keyof typeof MessageVariants;
    },
  ) {
    const { chatId, content, type, userId } = payload;
    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
      },
      select: {
        Orders: {
          select: {
            status: true,
          },
        },
      },
    });
    if (chat?.Orders[0].status === 'complete')
      throw new WsException('This Order is Already Marked As Completed');
    const data = await prisma.message.create({
      data: {
        content,
        bySystem: false,
        Chat: {
          connect: {
            id: chatId,
          },
        },
        sender: {
          connect: {
            id: userId,
          },
        },
        type,
      },
      select: {
        bySystem: true,
        createdAt: true,
        content: true,
        chatId: true,
        type: true,
        sender: {
          select: {
            username: true,
            profileURL: true,
          },
        },
        id: true,
      },
    });
    client.in(`channel_${chatId}`).emit('MESSAGE_CREATE', {
      ...data,
    });
  }
}
