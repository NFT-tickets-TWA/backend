import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserRoleInput {
  @Field(() => Int)
  personID: number;
  @Field(() => Int)
  roleID: number;
}
