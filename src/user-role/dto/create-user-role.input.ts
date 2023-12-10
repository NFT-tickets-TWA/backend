import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserRoleInput {
  @Field(() => Int)
  person_id: number;
  @Field(() => Int)
  role_id: number;
}
