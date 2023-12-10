import {ObjectType, Field, Int, ID} from '@nestjs/graphql';


@ObjectType()
export class ParticipantList {
  @Field(() => ID)
  id: number;

  @Field(() => Int)
  personID: number;

  @Field(() => Int)
  eventID: number;

  @Field(() => Int)
  statusID: number;
}
