import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType({description:"тип мероприятия"})
export class Type {
  @Field(()=>Int)
  id:number;
  @Field(() => String )
  type: string;

}
