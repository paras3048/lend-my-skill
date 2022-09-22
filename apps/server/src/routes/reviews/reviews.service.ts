import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { prisma } from 'src/lib/db';

@Injectable()
export class ReviewsService {
  async fetchReviewsOfUser(username: string, skip?: number, take?: number) {
    const reviews = await prisma.reviews.findMany({
      where: {
        reviewed: {
          username: username.toLowerCase(),
        },
      },
      skip: skip || undefined,
      take: take || 20,
      orderBy: {
        createdAt: 'asc',
      },
      select: {
        message: true,
        stars: true,
        createdAt: true,
        creatorId: true,
        id: true,
      },
    });

    const reviewsToSend: any[] = [];
    for (const r of reviews) {
      const creator = await prisma.user.findFirst({
        where: {
          id: r.creatorId,
        },
        select: {
          username: true,
          profileURL: true,
        },
      });
      reviewsToSend.push({ ...r, creator });
    }

    const reviewsCount = await prisma.reviews.count({
      where: {
        reviewed: {
          username: username.toLowerCase(),
        },
      },
    });
    return { reviews: reviewsToSend, reviewsCount };
  }

  async createReview({
    username,
    message,
    stars,
    userId,
  }: {
    username: string;
    userId: string;
    stars: number;
    message: string;
  }) {
    const user = await prisma.user.findFirst({
      where: {
        username: username.toLowerCase(),
      },
      select: {
        id: true,
        ratedBy: true,
        rating: true,
        reviewsRecieved: {
          select: {
            stars: true,
          },
        },
      },
    });

    const buyer = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        id: true,
      },
    });

    if (!user)
      throw new NotFoundException(
        undefined,
        'No User Found with provided Username.',
      );
    if (!buyer)
      throw new UnauthorizedException(
        undefined,
        "You're not allowed to perform this action.",
      );
    const order = await prisma.orders.findFirst({
      where: {
        sellerId: user.id,
        buyerId: buyer.id,
      },
    });
    if (!order)
      throw new BadRequestException(
        undefined,
        'You Should Hire this User Once to Post A Review.',
      );
    const review = await prisma.reviews.findFirst({
      where: {
        creatorId: userId,
      },
    });
    if (review !== null)
      throw new BadRequestException(
        undefined,
        "You've Already Reviewed this user.",
      );

    let reviewsCount = stars;
    for (const r of user.reviewsRecieved) {
      reviewsCount += r.stars;
    }
    const averageRating = Number(
      BigInt(reviewsCount) / BigInt(user.ratedBy + BigInt(1)),
    );
    const newReview = await prisma.reviews.create({
      data: {
        reviewer: {
          connect: {
            id: userId,
          },
        },
        message,
        reviewed: {
          connect: {
            id: user.id,
          },
        },
        stars,
      },
    });
    await prisma.user.update({
      where: {
        username: username.toLowerCase(),
      },
      data: {
        ratedBy: {
          increment: 1,
        },
        rating: averageRating,
      },
    });
    return {};
  }
}
