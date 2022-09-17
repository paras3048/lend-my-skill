import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BaseGuard } from 'src/guards/base.guard';
import { verifyJWT } from 'src/helpers/jwt';
import { prisma } from 'src/lib/db';
import { CreatePosting, FetchPosting } from 'src/validators/postings';
import { PostingsService } from './postings.service';

interface CreatePosting {
  title: string;
  description: string;
  userId: string;
  offers: {
    deliveryTime: number;
    name: string;
    description: string;
    price: number;
  }[];
  heroImage: string;
  images?: string[];
  categories: string[];
}

@Controller('postings')
export class PostingsController {
  constructor(protected readonly service: PostingsService) {}
  @Post('/fetch')
  async fetchPosting(@Body() body: { title: string; username: string }) {
    try {
      await FetchPosting.validateAsync(body);
    } catch (e) {
      throw new BadRequestException(undefined, e.details[0].message);
    }
    return await this.service.fetchPosting(
      body.title.toLowerCase(),
      body.username,
    );
  }
  @Post('/create')
  @UseGuards(BaseGuard)
  async createPosting(
    @Body() body: CreatePosting,
    @Headers('authorization') auth: string,
  ) {
    try {
      await CreatePosting.validateAsync(body);
    } catch (e) {
      console.log(e);
      throw new BadRequestException(undefined, e.details[0].message);
    }
    const id = verifyJWT(auth)!;
    return await this.service.createPosting({ ...body, userId: id });
  }
  @Get('/fetch/:username/all')
  async fetchPostings(
    @Param('username') username: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    const user = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: 'insensitive',
        },
      },
    });
    if (!user)
      throw new NotFoundException(
        undefined,
        'No user Found With Given Username',
      );
    return await prisma.postings.findMany({
      where: {
        User: {
          username: {
            equals: username,
            mode: 'insensitive',
          },
        },
      },
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
      skip: skip ? parseInt(skip) : 0,
      take: take ? parseInt(take) : 20,
    });
  }
}
