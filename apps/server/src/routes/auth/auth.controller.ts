import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  Headers,
  NotFoundException,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { SALT_ROUNDS, STORAGE_BUCKET_URL, WEBHOOK_URL } from 'src/constants';
import { BaseGuard } from 'src/guards/base.guard';
import { createJWT, verifyJWT } from 'src/helpers/jwt';
import { prisma } from 'src/lib/db';
import axios from 'axios';
interface BodyParams {
  email: string;
  password: string;
  username: string;
  profileURL: string;
  name: string;
  kycDocuments: string | string[];
}

interface LoginParams {
  email: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  @Post('signup')
  async createNewUserAccount(@Body() body: BodyParams) {
    const { email, name, password, username } = body;
    if (!email) throw new BadRequestException(undefined, 'Email Is Required');
    if (!name) throw new BadRequestException(undefined, 'Name Is Required');
    if (!password)
      throw new BadRequestException(undefined, 'Password Is Required');
    if (!username)
      throw new BadRequestException(undefined, 'Username Is Required');
    const oldUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (oldUser)
      throw new BadRequestException(
        undefined,
        'Email Address is Already in use.',
      );
    const oldUserWithSameUsername = await prisma.user.findFirst({
      where: {
        username: username.toLowerCase(),
      },
    });
    if (oldUserWithSameUsername)
      throw new BadRequestException(undefined, 'Username is Already Taken.');
    //   Now We're Ensured that there is no user with same email and username
    const hashedPassword = await hash(password, SALT_ROUNDS);
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        username: username.toLowerCase(),
        notifications: {
          create: {
            name: 'Welcome.',
            description: `Welcome OnBoard ${name} 🥳 . Thanks For Creating An Account on Our Platform. You can Sidebar or Tabs to Navigate in the Application.`,
          },
        },
      },
      select: {
        username: true,
        name: true,
        id: true,
        profileURL: true,
        verified: true,
        acceptingOrders: true,
        postings: true,
        reviews: true,
        rating: true,
      },
    });
    const jwt = createJWT(newUser.id);
    if (process.env.NODE_ENV !== 'development') {
      axios
        .post(WEBHOOK_URL, {
          content: 'New User Registered',
          username: 'Lend My Skill',
          embeds: [
            {
              title: `New User Registered with Username ${newUser.username}`,
              fields: [
                {
                  name: 'User Id',
                  value: `${newUser.id}`,
                },
              ],
              color: 2023659,
            },
          ],
        })
        .catch(() => null);
    }
    return {
      token: jwt,
      user: {
        ...newUser,
        postings: newUser.postings.length,
        reviews: newUser.reviews.length,
      },
    };
  }
  @Post('login')
  async login(@Body() body: LoginParams) {
    const user = await prisma.user.findFirst({
      where: {
        email: body.email,
      },
      select: {
        email: true,
        password: true,
        username: true,
        name: true,
        id: true,
        profileURL: true,
        verified: true,
        acceptingOrders: true,
        postings: true,
        reviews: true,
        rating: true,
        banned: true,
        reasonForBan: true,
      },
    });
    if (!user)
      throw new NotFoundException(
        undefined,
        'No User Found With Provided Details.',
      );
    if (user.banned) {
      throw new ForbiddenException(
        undefined,
        `You've been Banned From Using This Platform. Reason: ${user.reasonForBan}`,
      );
    }
    const isPasswordSame = await compare(body.password, user.password);
    if (isPasswordSame === false)
      throw new UnauthorizedException(undefined, 'Incorrect Password!');
    const jwt = createJWT(user.id);
    delete user.password;
    return {
      token: jwt,
      user: {
        ...user,
        postings: user.postings.length,
        reviews: user.reviews.length,
      },
    };
  }
  @Get('/profile')
  @UseGuards(BaseGuard)
  async returnProfile(@Headers('authorization') auth: string) {
    const id = verifyJWT(auth)!;
    const user = await prisma.user.findFirst({
      where: {
        id,
      },
      select: {
        username: true,
        name: true,
        id: true,
        profileURL: true,
        verified: true,
        acceptingOrders: true,
        postings: true,
        reviews: true,
        rating: true,
      },
    });
    const token = createJWT(user.id);
    return {
      token,
      user: {
        ...user,
        postings: user.postings.length,
        reviews: user.reviews.length,
      },
    };
  }
}
