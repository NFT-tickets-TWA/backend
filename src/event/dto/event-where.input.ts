import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import {PersonRelationFilter} from "./person-relation-filter.input";
import {Event as EventDB} from '@prisma/client';
@InputType()
export class EventWhereInput {

    @Field(() => String, {nullable:true})
    name?: EventDB["name"];

    @Field(() => PersonRelationFilter, {nullable:true})
    creator?: PersonRelationFilter;
}
