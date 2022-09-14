import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { prisma } from 'src/lib/db';

@Controller('search')
export class SearchController {
  @Post('/category')
  async fetchPostings(@Body() id: { id: string }) {
    if (!id || !id.id)
      throw new BadRequestException(undefined, 'Invalid Parameter');
    const posting = await prisma.postings.findMany({
      where: {
        category: {
          some: {
            id: id.id,
          },
        },
      },
      select: {
        heroImage: true,
        title: true,
        slugifiedTitle: true,
        id: true,
        postedAt: true,
        User: {
          select: {
            username: true,
            profileURL: true,
          },
        },
      },
    });
    return posting;
  }
  @Post('/term')
  async fetchPostingsUsingSearchTerm(@Body() ok: { term: string }) {
    if (!ok || !ok.term)
      throw new BadRequestException(undefined, 'Invalid Parameter');
    const posting = await prisma.postings.findMany({
      where: {
        OR: [
          {
            title: {
              contains: ok.term,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: ok.term,
              mode: 'insensitive',
            },
          },
        ],
      },
      select: {
        heroImage: true,
        title: true,
        slugifiedTitle: true,
        id: true,
        postedAt: true,
        User: {
          select: {
            username: true,
            profileURL: true,
          },
        },
      },
    });
    return posting;
  }
}
