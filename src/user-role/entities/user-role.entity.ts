import { ObjectType, Field, Int } from '@nestjs/graphql';
import {Role} from "../../role/entities/role.entity";
import {Person} from "../../person/entities/person.entity";

@ObjectType()
export class UserRole {
  @Field(() => Int)
  id: number;
  @Field(() => Int)
  person_id: number;
  @Field(() => Int)
  role_id: number;
  @Field(() => Role)
  role: Role;
  @Field(() => Person)
  person: Person;
}
