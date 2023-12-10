import {ObjectType, Field, Int} from '@nestjs/graphql';
import {Event} from "../../event/entities/event.entity"

@ObjectType()
export class Status {
    @Field(() => Int)
    id: number;
    @Field(() => String,)
    status: string;
    @Field(() => [Event])
    events: Event[];
}
