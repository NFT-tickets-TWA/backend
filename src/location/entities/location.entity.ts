import {ObjectType, Field, ID} from '@nestjs/graphql';
import { Location as LocationDB } from '@prisma/client';
@ObjectType()
export class Location {
    @Field(() => ID)
    id: LocationDB["id"];
    @Field(() => String, {nullable:true})
    address?: LocationDB["address"];
    @Field(() => Boolean)
    isOffline:LocationDB["isOffline"];
    @Field(() => String, {nullable:true, description: "ссылка на мероприятие, если оно онлайн"})
    link?:LocationDB["link"];
}
