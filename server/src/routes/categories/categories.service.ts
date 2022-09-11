import { BadRequestException, Injectable } from '@nestjs/common';
import { prisma } from 'src/lib/db';

@Injectable()
export class CategoriesService {
  async createCategory(name: string, description: string) {
    const c = await prisma.category.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive',
        },
      },
    });
    if (c !== null)
      throw new BadRequestException(
        undefined,
        'A Category With Given Name Already Exist',
      );
    const category = await prisma.category.create({
      data: {
        description,
        name,
      },
      select: {
        description: true,
        name: true,
      },
    });
    return category;
  }
  async fetchCategory(startingLetter: string) {
    const categories = await prisma.category.findMany({
      where: {
        OR: [
          {
            name: {
              contains: startingLetter,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: startingLetter,
              mode: 'insensitive',
            },
          },
        ],
      },
      select: {
        name: true,
        id: true,
      },
    });
    return categories;
  }
  async fetchAllCategories() {
    const categories = await prisma.category.findMany({
      where: {},
      select: {
        name: true,
        id: true,
      },
    });
    return categories;
  }
}
