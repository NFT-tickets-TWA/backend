import {ObjectType, Field, Int, GraphQLISODateTime, ID} from '@nestjs/graphql';
import {Location} from "../../location/entities/location.entity";

@ObjectType()
export class Event {
    @Field(() => ID)
    id: number;
    @Field(() => String)
    name: string;
    @Field(() => String, {nullable: true, description:"ссылка на обложку"})
    urlCover: string;
    @Field(() => String, {nullable: true})
    description: string;
    @Field(() => Boolean)
    isSBT: boolean;
    @Field(() => Int)
    creatorID: number;
    @Field(() => GraphQLISODateTime, {description:"начало мероприятия"})
    startedAt: Date;
    @Field(() => GraphQLISODateTime, {description:"конец мероприятия"})
    finishedAt: Date;
    @Field(() => Int, {nullable: true})
    locationID: number;
    @Field(() => String, {description:"ссылка на ipfs"})
    nftIpfsUrl: string;
    @Field(() => Int, {description:"количество зарегестрированных пользователей"})
    registeredParticipants: number
    @Field(() => Int)
    typeID: number
    @Field(() => Int)
    statusID: number
    @Field(() => String, {nullable: true, description:"ссылка для подтверждения регестрации"})
    approveLink: string
    @Field(() => Location, {nullable: true})
    location: Location
}
