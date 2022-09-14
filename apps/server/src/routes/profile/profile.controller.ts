import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Header,
  Headers,
  NotFoundException,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { SALT_ROUNDS, STORAGE_BUCKET_URL, WEBHOOK_URL } from 'src/constants';
import { BaseGuard } from 'src/guards/base.guard';
import { verifyJWT } from 'src/helpers/jwt';
import { prisma } from 'src/lib/db';
import { ProfileService } from './profile.service';
import * as joi from 'joi';
import axios from 'axios';

@Controller('profile')
export class ProfileController {
  constructor(protected readonly service: ProfileService) {}
  @Get(':username')
  async getUserProfile(@Param('username') username: string) {
    const user = await this.service.Profile(username.toLowerCase());
    if (!user)
      throw new NotFoundException(
        undefined,
        'No User Found With Given Username',
      );
    return user;
  }
  @Patch('bio')
  @UseGuards(BaseGuard)
  async updateBIO(
    @Body() body: { bio: string },
    @Headers('authorization') auth: string,
  ) {
    const id = verifyJWT(auth)!;
    const { username } = await this.service.getUserById(id);
    await this.service.updateProfile(username, {
      bio: body.bio,
    });
    return { success: true };
  }
  @Patch('detailed-bio')
  @UseGuards(BaseGuard)
  async updateDetailedBIO(
    @Body() body: { bio: string },
    @Headers('authorization') auth: string,
  ) {
    const id = verifyJWT(auth)!;
    const { username } = await this.service.getUserById(id);
    await this.service.updateProfile(username, {
      detailedBio: body.bio,
    });
    return { success: true };
  }
  @Get('details/access')
  @UseGuards(BaseGuard)
  async getFullProfileDetails(@Headers('authorization') auth: string) {
    const id = verifyJWT(auth)!;

    const user = await prisma.user.findFirst({
      where: {
        id,
      },
      select: {
        acceptingOrders: true,
        bio: true,
        detailedBio: true,
      },
    });

    return { ...user };
  }
  @Patch('profile-image')
  @UseGuards(BaseGuard)
  async updateProfilePicture(
    @Body() body: { url: string },
    @Headers('authorization') auth: string,
  ) {
    if (!body) throw new BadRequestException(undefined, "Body can't be empty.");
    if (!body.url)
      throw new BadRequestException(
        undefined,
        'Url of Profile Picture is Required.',
      );
    const id = verifyJWT(auth);
    const user = await prisma.user.findFirst({
      where: {
        id,
      },
    });
    if (!user)
      throw new NotFoundException(
        undefined,
        "The Resource You're Trying to Update Doesn't exist.",
      );
    await prisma.user.update({
      where: { id },
      data: {
        profileURL: body.url,
      },
    });
    axios
      .post(WEBHOOK_URL, {
        content: `User with Id: \`${id}\` and Username:\`${user.username}\` uploaded a profile photo`,
        embeds: [
          {
            title: 'New Profile Photo',
            image: {
              url: `${STORAGE_BUCKET_URL}/${body.url}`,
            },
          },
        ],
      })
      .catch(() => null);
    return {};
  }

  @Patch('password')
  @UseGuards(BaseGuard)
  async updatePassword(
    @Body() body: { newPassword: string },
    @Headers('authorization') auth: string,
  ) {
    try {
      const obj = joi.object({
        newPassword: joi.string().min(6).required(),
      });
      await obj.validateAsync(body);
    } catch (e) {
      throw new BadRequestException(undefined, e.details[0].message);
    }
    const id = verifyJWT(auth)!;
    const { username } = await this.service.getUserById(id);

    const newPassword = await hash(body.newPassword, SALT_ROUNDS);

    await this.service.updateProfile(username, {
      password: newPassword,
    });
    return { success: true };
  }
  @Patch('update/bulk')
  @UseGuards(BaseGuard)
  async updateProfile(
    @Body()
    body: {
      acceptingOrders: boolean;
      bio: string;
      detailedBio: string;
    },
    @Headers('authorization') auth: string,
  ) {
    try {
      const obj = joi.object({
        acceptingOrders: joi.boolean().required(),
        bio: joi.string().required(),
        detailedBio: joi.string().required(),
      });
      await obj.validateAsync(body);
    } catch (e) {
      throw new BadRequestException(undefined, e.details[0].message);
    }
    const id = verifyJWT(auth)!;
    const { username } = await this.service.getUserById(id);
    await this.service.updateProfile(username, {
      ...body,
    });
    return { success: true };
  }
}
