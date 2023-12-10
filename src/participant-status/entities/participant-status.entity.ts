import {ObjectType, Field, Int, ID} from '@nestjs/graphql';

@ObjectType()
export class ParticipantStatus {
  @Field(() => ID)
  id: number;
  @Field(() => Int)
  status: string;

}
