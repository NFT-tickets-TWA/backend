import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';

@InputType()
export class PersonWhereInput {

    @Field(() => String, {nullable:true})
    tgID?: string;
}
