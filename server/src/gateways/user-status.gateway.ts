import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WsException,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { verifyJWT } from 'src/helpers/jwt';
import { verifyConnectPayload } from 'src/helpers/socket';
import { prisma } from 'src/lib/db';

@WebSocketGateway({ cors: true })
export class UserStatusGateway implements OnGatewayConnection {
  async handleConnection(client: Socket, ...args: any[]) {
    const isValidConnection = await verifyConnectPayload({
      auth: client.handshake.auth,
    });
    if (isValidConnection === false)
      throw new WsException('Invalid Auth Payload');
    const user = await prisma.user.findFirst({
      where: {
        id: verifyJWT(client.handshake.auth.token)!,
      },
      select: {
        status: true,
        id: true,
      },
    });
    if (user === null) throw new WsException('No User Found');
    if (user.status === 'dnd') return;
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        status: 'online',
      },
    });
  }
  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any) {
    client.emit('response', 'hello world');
  }
}
