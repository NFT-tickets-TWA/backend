import {ObjectType, Field, ID} from '@nestjs/graphql';

@ObjectType()
export class Status {
    @Field(() => ID)
    id: number;
    @Field(() => String,)
    status: string;
}
