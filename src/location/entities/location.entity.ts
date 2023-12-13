import {ObjectType, Field, ID} from '@nestjs/graphql';

@ObjectType()
export class Location {
    @Field(() => ID)
    id: number;
    @Field(() => String, {nullable:true})
    address?: string;
    @Field(() => Boolean)
    isOffline:boolean;
    @Field(() => String, {nullable:true, description: "ссылка на мероприятие, если оно онлайн"})
    link?:string;
}
