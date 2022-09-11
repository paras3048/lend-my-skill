import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { prisma } from 'src/lib/db';

@Injectable()
export class ProfileService {
  async Profile(username: string): Promise<Partial<User> | null> {
    const partialProfile = await prisma.user.findFirst({
      where: {
        username,
      },
      select: {
        acceptingOrders: true,
        bio: true,
        verified: true,
        name: true,
        profileURL: true,
        username: true,
        ratedBy: true,
        rating: true,
        detailedBio: true,
        postings: {
          select: {
            description: true,
            id: true,
            title: true,
            postedAt: true,
            slugifiedTitle: true,
          },

          orderBy: {
            postedAt: 'desc',
          },
        },
        reviews: {
          select: {
            message: true,
            id: true,
            User: {
              select: {
                username: true,
                profileURL: true,
              },
            },
          },
        },
      },
    });
    return partialProfile;
  }
  async updateProfile(username: string, profile: Partial<Omit<User, 'email'>>) {
    await prisma.user.update({
      where: {
        username,
      },
      data: profile,
    });
  }
  async getUserById(id: string) {
    return await prisma.user.findFirst({
      where: {
        id,
      },
      select: {
        username: true,
      },
    });
  }
}
