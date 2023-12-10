import {InputType, Int, Field, GraphQLISODateTime, ObjectType} from '@nestjs/graphql';


@InputType()
export class CreateEventInput {

  @Field(()=>String)
  name:string;
  @Field(()=>String, {nullable:true})
  urlCover:string;
  @Field(()=>String, {nullable:true})
  description:string;
  @Field(()=>Boolean)
  isSBT:boolean;
  @Field(()=>GraphQLISODateTime)
  started_at:string;
  @Field(()=>GraphQLISODateTime)
  finished_at:string;
  @Field(()=>Int, {nullable:true})
  locationID?:number | null;

  @Field(()=>String)
  nftIpfsUrl:string;
  @Field(()=>Int)
  countOfRewardTokens:number
  @Field(()=>Int, {nullable:true, defaultValue:1})
  typeId?:number|null
  @Field(()=>Int, {nullable:true, defaultValue:1})
  statusId?:number|null
  @Field(()=>Int, {nullable:true})
  approveLink:string
}