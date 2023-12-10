import {ObjectType, Field, ID} from '@nestjs/graphql';

@ObjectType()
export class Location {
    @Field(() => ID)
    id: number;
    @Field(() => String, {nullable:true})
    address?: string;
    @Field(() => String, {nullable:true})
    room?: string;
    @Field(() => Boolean)
    isOffline:boolean;
    @Field(() => String, {nullable:true})
    link?:string;
}
