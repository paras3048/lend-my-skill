import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BaseGuard } from 'src/guards/base.guard';
import { verifyJWT } from 'src/helpers/jwt';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(protected readonly service: ReviewsService) {}

  @Get('/:username')
  async fetchReview(
    @Param('username') username: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return await this.service.fetchReviewsOfUser(
      username,
      parseInt(skip || '0'),
      parseInt(take || '30'),
    );
  }
  @Post('/create')
  @UseGuards(BaseGuard)
  async createReview(
    @Body() body: { username: string; message: string,stars:number },
    @Headers('authorization') auth: string,
  ) {
    const userId = verifyJWT(auth)!;
    return await this.service.createReview({
      message: body.message,
      userId,
      username: body.username,
      stars:body.stars
    });
  }
}
