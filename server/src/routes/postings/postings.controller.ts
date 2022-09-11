import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { BaseGuard } from 'src/guards/base.guard';
import { verifyJWT } from 'src/helpers/jwt';
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
  categories:string[]
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
}
