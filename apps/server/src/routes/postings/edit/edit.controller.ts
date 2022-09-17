import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  NotFoundException,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import * as Joi from 'joi';
import { BaseGuard } from 'src/guards/base.guard';
import { verifyJWT } from 'src/helpers/jwt';
import { prisma } from 'src/lib/db';
import { EditService } from './edit.service';

@Controller('postings/edit')
@UseGuards(BaseGuard)
export class EditController {
  constructor(protected readonly service: EditService) {}
  @Patch('/description/:id')
  async updateDescription(
    @Body()
    body: {
      description: string;
    },
    @Param('id') id: string,
    @Headers('authorization') auth: string,
  ) {
    try {
      const d = Joi.object({
        description: Joi.string().required(),
      });
      d.validateAsync(body);
    } catch (e) {
      throw new BadRequestException(
        undefined,
        (e as Joi.ValidationError).details[0].message,
      );
    }
    const userId = verifyJWT(auth);
    const { error } = await this.service.checkIfPostingExist(userId, id);
    if (error === 404) {
      throw new NotFoundException(undefined, "The Resource Doesn't Exist.");
    }
    await this.service.updatePosting(id, {
      description: body.description,
    });
  }
  @Patch('/categories/:id')
  async updateCategories(
    @Body()
    body: {
      categories: string[];
    },
    @Param('id') id: string,
    @Headers('authorization') auth: string,
  ) {
    try {
      const d = Joi.object({
        categories: Joi.array().required().items(Joi.string().required()),
      });
      d.validateAsync(body);
    } catch (e) {
      throw new BadRequestException(
        undefined,
        (e as Joi.ValidationError).details[0].message,
      );
    }
    const userId = verifyJWT(auth);
    const { error } = await this.service.checkIfPostingExist(userId, id);
    if (error === 404) {
      throw new NotFoundException(undefined, "The Resource Doesn't Exist.");
    }
    await prisma.postings.update({
      where: {
        id,
      },
      data: {
        category: {
          connect: [...body.categories.map((e) => ({ id: e }))],
        },
      },
    });
    return {};
  }
  @Patch('/status/:id')
  async updateStatus(
    @Body()
    body: {
      acceptingOrder: boolean;
    },
    @Param('id') id: string,
    @Headers('authorization') auth: string,
  ) {
    try {
      const d = Joi.object({
        acceptingOrder: Joi.bool().required(),
      });
      d.validateAsync(body);
    } catch (e) {
      throw new BadRequestException(
        undefined,
        (e as Joi.ValidationError).details[0].message,
      );
    }
    const userId = verifyJWT(auth);
    const { error } = await this.service.checkIfPostingExist(userId, id);
    if (error === 404) {
      throw new NotFoundException(undefined, "The Resource Doesn't Exist.");
    }
    await prisma.postings.update({
      where: {
        id,
      },
      data: {
        acceptingOrders: body.acceptingOrder,
      },
    });
    return {};
  }
  @Patch('/bulk/:id')
  async updateDetails(
    @Body()
    body: {
      acceptingOrder: boolean | string;
      description: string;
      categories: string[];
    },
    @Param('id') id: string,
    @Headers('authorization') auth: string,
  ) {
    try {
      const d = Joi.object({
        acceptingOrder: Joi.bool().required(),
        description: Joi.string().required(),
        categories: Joi.array().items(Joi.string().required()).required(),
      });
      await d.validateAsync(body);
    } catch (e) {
      throw new BadRequestException(
        undefined,
        (e as Joi.ValidationError).details[0].message,
      );
    }
    const userId = verifyJWT(auth);
    const { error } = await this.service.checkIfPostingExist(userId, id);
    if (error === 404) {
      throw new NotFoundException(undefined, "The Resource Doesn't Exist.");
    }
    await prisma.postings.update({
      where: {
        id,
      },
      data: {
        acceptingOrders:
          typeof body.acceptingOrder === 'boolean'
            ? body.acceptingOrder
            : body.acceptingOrder.toLowerCase() === 'yes'
            ? true
            : false,
        description: body.description,
        category: {
          connect: body.categories.map((c) => ({ id: c })),
        },
      },
    });
    return {};
  }
}
