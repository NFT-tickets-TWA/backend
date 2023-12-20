import {InputType, Int, Field, ID} from '@nestjs/graphql';
import { ParticipantList as ParticipantListDB } from '@prisma/client';
@InputType()
export class CreateParticipantListInput {
  @Field(() => Int)
  personID: number;
  @Field(() => Int)
  eventID: number;
}
