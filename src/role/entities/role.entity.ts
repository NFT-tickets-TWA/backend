import {ObjectType, Field, ID} from '@nestjs/graphql';

@ObjectType({description:"роли людей"})
export class Role {
  @Field(() => ID)
  id: number;
  @Field(() => String)
  name: string;
}
