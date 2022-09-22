import {
  OnGatewayConnection,
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
      postingTitle: string;
    },
  ) {
    const { amount, buyerId, sellerId, packageName, postingTitle } = props;
    const seller = await prisma.user.findFirst({
      where: {
        id: sellerId,
      },
      select: {
        acceptingOrders: true,
        postings: {
          where: {
            slugifiedTitle: postingTitle.toLowerCase(),
          },
          take: 1,
        },
      },
    });

    const buyer = await prisma.user.findFirst({
      where: {
        id: buyerId,
      },
      select: {
        verified: true,
        banned: true,
        reasonForBan: true,
      },
    });
    if (buyer === null) {
      throw new WsException('No User Found With Given Id');
    }
    if (buyer.banned) {
      throw new WsException(
        `You've been banned from using this platform. Reason: ${buyer.reasonForBan!}`,
      );
    }
    if (!buyer.verified) {
      throw new WsException(
        'Your Account is not verified. Please Check Your Email for the instructions to verify your account.',
      );
    }

    if (seller === null) throw new WsException('No User Found With Given Id');
    if (seller.acceptingOrders === false)
      throw new WsException('The User Is Not Accepting Orders');
    if (!seller.postings[0])
      throw new WsException('No Posting Found With Given Title.');
    if (seller.postings[0].acceptingOrders === false)
      throw new WsException('The User Is Not Accepting Orders on This Posting');
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
