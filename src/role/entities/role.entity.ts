import { ObjectType, Field, Int } from '@nestjs/graphql';
import {UserRole} from "../../user-role/entities/user-role.entity";

@ObjectType()
export class Role {
  @Field(() => Int)
  id: number;
  @Field(() => String)
  name: string;
  @Field(() => [UserRole])
  roles: UserRole[];
}
