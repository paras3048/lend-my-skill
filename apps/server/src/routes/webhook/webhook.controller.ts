import { Body, Controller, Headers, Post } from '@nestjs/common';
import axios from 'axios';
import { WEBHOOK_SECRET, WEBHOOK_URL } from 'src/constants';
import { prisma } from 'src/lib/db';
import { Webhook_payload } from 'src/types/webhook';
/* eslint-disable */
const {
  validateWebhookSignature,
} = require('razorpay/dist/utils/razorpay-utils');
/* eslint-enable */
@Controller('webhook')
export class WebhookController {
  @Post('/')
  async test(
    @Headers('X-Razorpay-Signature') razorpaySignature: string,
    @Body() body: Webhook_payload,
  ) {
    const data = validateWebhookSignature(
      JSON.stringify(body),
      razorpaySignature,
      WEBHOOK_SECRET,
    );
    console.log(data);
    const payment = body.payload.payment.entity;
    if (payment.status === 'captured') {
      if (payment.notes.order_type === 'SERVICE_PURCHASE') {
        const { sellerId, buyerId, packageName } = payment.notes;
        const seller = await prisma.user.findFirst({
          where: {
            id: sellerId,
          },
        });
        const buyer = await prisma.user.findFirst({
          where: {
            id: buyerId,
          },
        });

        await prisma.orders.create({
          data: {
            buyerId,
            sellerId,
            price: (payment.amount - (payment.fee + payment.tax)) / 100,
            chat: {
              create: {
                buyerId,
                sellerId,
                user: {
                  connect: {
                    id: buyer.id,
                  },
                },
                messages: {
                  create: {
                    content: `This is a Chat Between ${buyer.name} and ${seller.name}. The ${buyer.name} bought ${packageName} Offer.`,
                    bySystem: true,
                    sender: {
                      connect: {
                        id: buyer.id,
                      },
                    },
                  },
                },
              },
            },
          },
        });
        await prisma.notifications.create({
          data: {
            description: `You've A New Order by ${buyer.name}`,
            name: 'New Order!',
            User: {
              connect: {
                id: seller.id,
              },
            },
          },
        });
        axios
          .post(WEBHOOK_URL, {
            content: 'New Order Created',
            username: 'Lend My Skill',
            embeds: [
              {
                title: `New Order Created, Send Them an Email`,
                fields: [
                  {
                    name: 'Buyer Username',
                    value: `${buyer.username}`,
                  },
                  {
                    name: 'Buyer Id',
                    value: `${buyer.id}`,
                  },
                  {
                    name: 'Seller Username',
                    value: `${seller.username}`,
                  },
                  {
                    name: 'Seller Id',
                    value: `${seller.id}`,
                  },
                ],
                color: 2023659,
              },
            ],
          })
          .catch(() => null);
      }
    }
    return {};
  }
}
