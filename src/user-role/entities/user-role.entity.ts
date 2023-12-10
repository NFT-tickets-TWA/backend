import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class UserRole {
  @Field(() => Int)
  id: number;
  @Field(() => Int)
  person_id: number;
  @Field(() => Int)
  role_id: number;
}
