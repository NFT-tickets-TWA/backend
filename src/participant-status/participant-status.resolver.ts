import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ParticipantStatusService } from './participant-status.service';
import { ParticipantStatus } from './entities/participant-status.entity';

@Resolver(() => ParticipantStatus)
export class ParticipantStatusResolver {

}
