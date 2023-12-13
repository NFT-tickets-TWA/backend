import {ObjectType, Field, Int, GraphQLISODateTime, ID} from '@nestjs/graphql';
import {Location} from "../../location/entities/location.entity";
import { Event as EventDB } from '@prisma/client';

@ObjectType()
export class Event {
    @Field(() => ID)
    id: EventDB["id"];
    @Field(() => String)
    name: EventDB["name"];
    @Field(() => String, {nullable: true, description:"ссылка на обложку"})
    urlCover: EventDB["urlCover"];
    @Field(() => String, {nullable: true})
    description: EventDB["description"];
    @Field(() => Boolean)
    isSBT: EventDB["isSBT"];
    @Field(() => Int)
    creatorID: EventDB["creatorID"];
    @Field(() => GraphQLISODateTime, {description:"начало мероприятия"})
    startedAt: EventDB["startedAt"];
    @Field(() => GraphQLISODateTime, {description:"конец мероприятия"})
    finishedAt: EventDB["finishedAt"];
    @Field(() => Int, {nullable: true})
    locationID: EventDB["locationID"];
    @Field(() => String, {description:"ссылка на ipfs"})
    nftIpfsUrl: EventDB["nftIpfsUrl"];
    @Field(() => Int, {description:"количество зарегестрированных пользователей"})
    registeredParticipants: EventDB["registeredParticipants"];
    @Field(() => String)
    type: EventDB["type"];
    @Field(() => String)
    status: EventDB["type"];
    @Field(() => String, {nullable: true, description:"ссылка для подтверждения регестрации"})
    approveLink: string
    @Field(() => Location, {nullable: true})
    location: Location
}
