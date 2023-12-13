import {InputType, Int, Field, GraphQLISODateTime} from '@nestjs/graphql';
import {Event as EventDB, EventStatus, EventType} from '@prisma/client';

@InputType()
export class CreateEventInput {
  @Field(()=>String)
  name:string;
  @Field(()=>String, {nullable:true, defaultValue:"NOT_STATED"})
  type?:EventType;
  @Field(()=>String, {nullable:true, defaultValue:"REGISTRATION_CLOSED"})
  status?:EventStatus;
  @Field(()=>String, {nullable:true})
  urlCover?:string;
  @Field(()=>String, {nullable:true})
  description?:string;
  @Field(()=>Boolean)
  isSBT:boolean;
  @Field(()=>GraphQLISODateTime)
  startedAt:string;
  @Field(()=>GraphQLISODateTime)
  finishedAt:string;
  @Field(()=>Int, {nullable:true})
  locationID?:number;
  @Field(()=>String)
  nftIpfsUrl:string;
  @Field(()=>Int)
  countOfRewardTokens:number;
  @Field(()=>String, {nullable:true})
  approveLink:string;
}