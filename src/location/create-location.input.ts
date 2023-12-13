import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateLocationInput {
  @Field(() => String, {nullable:true})
  address?: string;
  @Field(() => Boolean)
  isOffline:boolean;
  @Field(() => String, {nullable:true})
  link?:string;
}
