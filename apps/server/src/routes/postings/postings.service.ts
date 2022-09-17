import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { stringToSlug } from 'src/helpers/url';
import { prisma } from 'src/lib/db';

interface CreatePosting {
  title: string;
  description: string;
  userId: string;
  offers: {
    deliveryTime: number;
    name: string;
    price: number;
    description: string;
  }[];
  heroImage: string;
  images?: string[];
  categories: string[];
}

@Injectable()
export class PostingsService {
  async fetchPosting(title: string, username: string) {
    const posting = await prisma.postings.findFirst({
      where: {
        User: {
          username,
        },
        slugifiedTitle: title,
      },
      select: {
        id: true,
        postedAt: true,
        description: true,
        title: true,
        User: {
          select: {
            username: true,
            acceptingOrders: true,
            bio: true,
            name: true,
            profileURL: true,
            rating: true,
            verified: true,
            ratedBy: true,
            createdAt: true,
            id: true,
          },
        },
        offers: {
          select: {
            deliveryTime: true,
            description: true,
            name: true,
            price: true,
            id: true,
          },
        },
        heroImage: true,
        images: true,
        category: {
          select: {
            name: true,
            id: true,
          },
        },
        acceptingOrders: true,
      },
    });
    if (posting === null)
      throw new NotFoundException(undefined, 'No Posting Found');
    return posting;
  }
  async createPosting(props: CreatePosting) {
    const {
      description,
      offers,
      title,
      userId,
      heroImage,
      images,
      categories,
    } = props;
    const oldPosting = await prisma.postings.findFirst({
      where: {
        slugifiedTitle: `${stringToSlug(title)}-${Date.now()}`,
      },
    });
    if (oldPosting !== null)
      throw new BadRequestException(
        undefined,
        'Another Posting With Same Title Already Exist.',
      );
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });
    if (!user)
      throw new BadRequestException(
        undefined,
        'No User Found With Specified Id',
      );
    if (!user.verified)
      throw new BadRequestException(
        undefined,
        'Your Account Should Be Verified to Create Posting, Please Keep checking for an email from our team regularly.',
      );
    const posting = await prisma.postings.create({
      data: {
        description,
        heroImage,
        slugifiedTitle: `${stringToSlug(title)}-${Date.now()}`,
        title,
        images,
        User: {
          connect: {
            id: userId,
          },
        },
        offers: {
          createMany: {
            data: [
              ...offers.map((o) => ({
                deliveryTime: o.deliveryTime,
                description: o.description,
                name: o.name,
                price: o.price,
              })),
            ],
          },
        },
        category: {
          connect: categories.map((c) => ({ id: c })),
        },
      },
      select: {
        id: true,
        postedAt: true,
        description: true,
        title: true,
        User: {
          select: {
            username: true,
            acceptingOrders: true,
            bio: true,
            name: true,
            profileURL: true,
            rating: true,
            verified: true,
            ratedBy: true,
            id: true,
          },
        },
        offers: {
          select: {
            deliveryTime: true,
            description: true,
            name: true,
            price: true,
            id: true,
          },
        },
        heroImage: true,
        images: true,
      },
    });
    return posting;
  }
}
