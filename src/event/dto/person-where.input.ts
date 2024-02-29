import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import {Person as PersonDB} from '@prisma/client';
@InputType()
export class PersonWhereInput {

    @Field(() => String, {nullable:true})
    tgID?: PersonDB["tgID"];
}
