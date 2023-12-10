import { ObjectType, Field, Int } from '@nestjs/graphql';
import {ParticipantList} from "../../participant-list/entities/participant-list.entity";

@ObjectType()
export class ParticipantStatus {
  @Field(() => Int)
  id: number;
  @Field(() => Int)
  status: string;

  @Field(() => [ParticipantList])
  participantLists: ParticipantList[];
}
