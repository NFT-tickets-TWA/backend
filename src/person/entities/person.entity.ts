import {Field, Int, ObjectType} from "@nestjs/graphql";
import { Person as PersonDB } from '@prisma/client';
import {UserRole} from "../../user-role/entities/user-role.entity";
import {ParticipantList} from "../../participant-list/entities/participant-list.entity";
import {Event} from "../../event/entities/event.entity";
@ObjectType()
export class Person{
  @Field(() => Int)
  id: PersonDB[`id`];
  @Field(() => String)
  walletAddress: PersonDB[`walletAddress`];
  @Field(() => String)
  tgId: PersonDB[`tgId`];
  @Field(() => [UserRole])
  roles: UserRole[];

  @Field(() => [ParticipantList])
  ParticipantList: ParticipantList[];

  @Field(() => [Event])
  events: Event[];

}