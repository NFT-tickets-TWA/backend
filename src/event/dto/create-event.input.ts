import {InputType, Int, Field, GraphQLISODateTime, ID} from '@nestjs/graphql';
import {Event as EventDB} from '@prisma/client';


@InputType()
export class CreateEventInput {
    @Field(() => String)
    name: EventDB["name"];
    @Field(() => String, {nullable: true, defaultValue: "NOT_STATED"})
    type?: EventDB["type"];
    @Field(() => String, {nullable: true, defaultValue: "REGISTRATION_OPENED"})
    status?: EventDB["status"];
    @Field(() => String, {nullable: true})
    urlCover?: EventDB["urlCover"];
    @Field(() => String, {nullable: true})
    description?: EventDB["description"];
    @Field(() => Boolean)
    isSBT: EventDB["isSBT"];
    @Field(() => GraphQLISODateTime)
    startedAt: EventDB["startedAt"];
    @Field(() => GraphQLISODateTime)
    finishedAt: EventDB["finishedAt"];
    @Field(() => GraphQLISODateTime, {nullable: true})
    registrationFinishedAt?: EventDB["registrationFinishedAt"];
    @Field(() => Int, {nullable: true})
    locationID?: number;
    @Field(() => String)
    nftIpfsUrl: EventDB["nftIpfsUrl"];
    @Field(() => Int)
    countOfRewardTokens: EventDB["countOfRewardTokens"];
    @Field(() => String, {nullable: true})
    approveLink: EventDB["approveLink"];
}


