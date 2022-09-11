import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WsException,
} from '@nestjs/websockets';
import { Razorpay } from 'modules/razorpay';
import { Socket } from 'socket.io';
import { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } from 'src/constants';
import { verifyConnectPayload } from 'src/helpers/socket';
import { prisma } from 'src/lib/db';

@WebSocketGateway({ cors: true })
export class OrdersGateway implements OnGatewayConnection {
  async handleConnection(client: Socket, ...args: any[]) {
    const data = await verifyConnectPayload({ auth: client.handshake.auth });
    if (data === false) {
      throw new WsException('Invalid Auth Payload Provided');
    }
    if (!client.handshake.query.userId)
      throw new WsException('No UserId Provided');
    console.log(client.handshake);
    client.join(`order_${client.handshake.query.userId}`);
  }
  @SubscribeMessage('ORDER_CREATE')
  async createOrder(
    client: Socket,
    props: {
      amount: number;
      sellerId: string;
      buyerId: string;
      packageName: string;
    },
  ) {
    const { amount, buyerId, sellerId, packageName } = props;
    console.log(props);
    const razorpay = new Razorpay(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET);
    const trackedOrder = await prisma.trackedOrders.create({
      data: {
        buyerId,
        sellerId,
      },
      select: {
        id: true,
      },
    });
    const { id } = await razorpay.createOrder({
      amount,
      currency: 'INR',
      notes: { order_type: 'SERVICE_PURCHASE', buyerId, sellerId, packageName },
      partialPayment: false,
      receipt: trackedOrder.id,
    });
    client.emit('ORDER_CREATE', { orderId: id });
  }
}
