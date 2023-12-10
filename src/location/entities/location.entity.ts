import {ObjectType, Field, Int} from '@nestjs/graphql';
import {Event} from "../../event/entities/event.entity"

@ObjectType()
export class Location {
    @Field(() => Int)
    id: number;
    @Field(() => String, {nullable:true})
    address?: string;
    @Field(() => String, {nullable:true})
    room?: string;
    @Field(() => Boolean)
    isOffline:boolean;
    @Field(() => String, {nullable:true})
    link?:string;
    @Field(() => [Event])
    events: Event[];
    // events    Event[]
}
