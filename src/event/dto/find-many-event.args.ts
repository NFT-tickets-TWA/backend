import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';

import { Type } from 'class-transformer';
import {EventWhereInput} from "./event-where.input";

@ArgsType()
export class FindManyEventArgs {

    @Field(() => EventWhereInput, {nullable:true})
    @Type(() => EventWhereInput)
    where?: EventWhereInput;

}
