import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import {PersonRelationFilter} from "./person-relation-filter.input";

@InputType()
export class EventWhereInput {

    @Field(() => String, {nullable:true})
    name?: string;

    @Field(() => PersonRelationFilter, {nullable:true})
    creator?: PersonRelationFilter;
}
