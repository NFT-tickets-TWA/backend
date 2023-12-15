import {Field, ID, ObjectType} from "@nestjs/graphql";
import { Person as PersonDB } from '@prisma/client';
import {ParticipantList} from "../../participant-list/entities/participant-list.entity";
import {Event} from "../../event/entities/event.entity";
@ObjectType()
export class Person{
  @Field(() => ID)
  id: PersonDB[`id`];
  @Field(() => String)
  tgID: PersonDB[`tgID`];
  @Field(() => String)
  role: PersonDB["role"];
  @Field(() => [ParticipantList])
  ParticipantList: ParticipantList[];
  @Field(() => [Event])
  events: Event[];
}