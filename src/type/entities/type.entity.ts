import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Type {
  @Field(()=>Int)
  id:number;
  @Field(() => String )
  type: string;

}
