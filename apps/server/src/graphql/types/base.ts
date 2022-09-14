import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field((_) => String)
  id: string;
  @Field((_) => String)
  username: string;
  @Field((_) => String, { nullable: true })
  email: string;
  @Field((_) => String)
  name: string;
  @Field((_) => Boolean)
  verified: boolean;
  @Field((_) => String)
  profileURL: string;
  @Field((_) => String)
  bannerURL: string;
  @Field((_) => String)
  bannerColor: string;
}
