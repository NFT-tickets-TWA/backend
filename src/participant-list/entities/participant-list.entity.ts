import {ObjectType, Field, Int, ID} from '@nestjs/graphql';


@ObjectType()
export class ParticipantList {
  @Field(() => ID)
  id: number;

  @Field(() => ID)
  personID: number;

  @Field(() => ID)
  eventID: number;

  @Field(() => String)
  status: string;
}
