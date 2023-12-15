import {InputType, Int, Field, ID} from '@nestjs/graphql';
import { ParticipantList as ParticipantListDB } from '@prisma/client';
@InputType()
export class CreateParticipantListInput {
  @Field(() => ID)
  personID: ParticipantListDB["personID"];
  @Field(() => ID)
  eventID: ParticipantListDB["eventID"];
}
