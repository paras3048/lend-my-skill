import { BadRequestException } from '@nestjs/common';
import {
  Args,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { hash } from 'bcrypt';
import { SALT_ROUNDS } from 'src/constants';
import { User } from 'src/graphql/types/base';
import { createJWT } from 'src/helpers/jwt';
import { prisma } from 'src/lib/db';

@ObjectType()
export class SignUpFunctionResponse {
  @Field((_) => String)
  token: string;
  @Field((_) => User)
  user: Partial<User>;
}

@Resolver()
export class AuthResolver {
  @Mutation((returns) => SignUpFunctionResponse, { nullable: true })
  async signup(
    @Args('username') username: string,
    @Args('password') password: string,
    @Args('email') email: string,
    @Args('profileURL') profileURL: string,
    @Args('name') name: string,
  ): Promise<SignUpFunctionResponse> {
    const oldUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (oldUser)
      throw new BadRequestException(
        { email: 'Email Address is Already Taken.' },
        undefined,
      );
    const oldUserWithSameUsername = await prisma.user.findFirst({
      where: {
        username,
      },
    });
    if (oldUserWithSameUsername)
      throw new BadRequestException(
        { username: 'Username is Already Taken.' },
        undefined,
      );
    //   Now We're Ensured that there is no user with same email and username
    const hashedPassword = await hash(password, SALT_ROUNDS);
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        username,
        profileURL,
      },
      select: {
        username: true,
        name: true,
        id: true,
        profileURL: true,
        verified: true,
      },
    });
    const jwt = createJWT(newUser.id);
    return {
      token: jwt,
      user: newUser,
    };
  }
}
