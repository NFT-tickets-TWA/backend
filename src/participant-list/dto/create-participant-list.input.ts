import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateParticipantListInput {
  @Field(() => Int)
  personID: number;
  @Field(() => Int)
  eventID: number;
}
