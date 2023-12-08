import {Field, Int, ObjectType} from "@nestjs/graphql";
import { Person as PersonDB } from '@prisma/client';
@ObjectType()
export class Person{
    @Field(() => Int,{description:})
    id: PersonDB[`id`];
    @Field(() => String)
    walletAddress: PersonDB[`walletAddress`];
    @Field(() => String)
    tgId: PersonDB[`tgId`];
    roles:          UserRole[]
    ParticipantList: ParticipantList[]
    events :         Event[]

}