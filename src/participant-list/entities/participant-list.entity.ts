import {ObjectType, Field, Int, ID} from '@nestjs/graphql';
import { ParticipantList as ParticipantListDB } from '@prisma/client';

@ObjectType()
export class ParticipantList {
  @Field(() => ID)
  id: ParticipantListDB["id"];

  @Field(() => ID)
  personID: ParticipantListDB["id"];

  @Field(() => ID)
  eventID: ParticipantListDB["id"];

  @Field(() => String)
  status: ParticipantListDB["status"];
}
