import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class UserRole {
  @Field(() => Int)
  id: number;
  @Field(() => Int)
  personID: number;
  @Field(() => Int)
  roleID: number;
}
