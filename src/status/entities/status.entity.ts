import {ObjectType, Field, ID} from '@nestjs/graphql';

@ObjectType({description:"статус мероприятия"})
export class Status {
    @Field(() => ID)
    id: number;
    @Field(() => String,)
    status: string;
}
