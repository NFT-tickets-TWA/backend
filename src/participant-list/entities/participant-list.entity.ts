import {ObjectType, Field, Int, ID} from '@nestjs/graphql';
import {ParticipantStatus} from "../../participant-status/entities/participant-status.entity";
import {Person} from "../../person/entities/person.entity";
import {Event} from "../../event/entities/event.entity"

@ObjectType()
export class ParticipantList {
  @Field(() => ID)
  id: number;

  @Field(() => Person)
  person: Person;

  @Field(() => Int)
  personID: number;

  @Field(() => Event)
  event: Event;

  @Field(() => Int)
  eventID: number;

  @Field(() => ParticipantStatus)
  status: ParticipantStatus;

  @Field(() => Int)
  statusID: number;
}
