import {Field, ID} from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';
import { Event as EventDB } from '@prisma/client';
@InputType()
export class EventWhereUniqueInput {

    @Field(() => ID, {nullable:true})
    id?: EventDB["id"];

    @Field(() => String, {nullable:true})
    approveLink?: string;

}
