import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import * as Joi from 'joi';
import { join } from 'path';
import { BaseGuard } from 'src/guards/base.guard';
import { CategoriesService } from './categories.service';

interface Body {
  name: string;
  description: string;
}

@Controller('categories')
export class CategoriesController {
  constructor(protected readonly service: CategoriesService) {}

  @Post('/create')
  @UseGuards(BaseGuard)
  async createCategory(@Body() body: Body) {
    try {
      const valid = Joi.object({
        name: Joi.string()
          .required()
          .regex(/^[A-Za-z]+$/),
        description: Joi.string()
          .required()
          .regex(/^[A-Za-z]+$/),
      });
      valid.validate(body);
    } catch (e) {
      throw new BadRequestException(
        undefined,
        (e as Joi.ValidationError).details[0].message,
      );
    }
    return await this.service.createCategory(body.name, body.description);
  }
  @Get('/fetch')
  async fetchCategories(@Query('q') q: string) {
    return this.service.fetchCategory(q);
  }
  @Get('/fetch/all')
  async fetchAllCategories() {
    return this.service.fetchAllCategories();
  }
}
