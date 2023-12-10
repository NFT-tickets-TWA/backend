import { ObjectType, Field, Int } from '@nestjs/graphql';
import {Event} from "../../event/entities/event.entity"

@ObjectType()
export class Type {
  @Field(()=>Int)
  id:number;
  @Field(() => String )
  type: string;
  @Field(() => [Event])
  events: Event[];
}
