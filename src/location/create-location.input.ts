import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateLocationInput {
  @Field(() => String, {nullable:true})
  address?: string;
  @Field(() => String, {nullable:true})
  room?: string;
  @Field(() => Boolean)
  isOffline:boolean;
  @Field(() => String, {nullable:true})
  link?:string;
}
