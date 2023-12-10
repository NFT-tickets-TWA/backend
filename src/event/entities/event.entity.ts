import {ObjectType, Field, Int, GraphQLISODateTime, ID} from '@nestjs/graphql';
import {Location} from "../../location/entities/location.entity";

@ObjectType()
export class Event {
    @Field(() => ID)
    id: number;
    @Field(() => String)
    name: string;
    @Field(() => String, {nullable: true})
    urlCover: string;
    @Field(() => String, {nullable: true})
    description: string;
    @Field(() => Boolean)
    isSBT: boolean;
    @Field(() => Int)
    creatorID: number;
    @Field(() => GraphQLISODateTime)
    started_at: Date;
    @Field(() => GraphQLISODateTime)
    finished_at: Date;
    @Field(() => Int, {nullable: true})
    locationID: number;
    @Field(() => String)
    nftIpfsUrl: string;
    @Field(() => String)
    contractAddress: string
    @Field(() => Int)
    registeredParticipants: number
    @Field(() => Int)
    countOfRewardTokens: number
    @Field(() => Int)
    typeId: number
    @Field(() => Int)
    statusId: number
    @Field(() => Int, {nullable: true})
    approveLink: string
    @Field(() => Location, {nullable: true})
    location: Location

}
