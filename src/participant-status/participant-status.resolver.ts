import { Resolver} from '@nestjs/graphql';
import { ParticipantStatus } from './entities/participant-status.entity';

@Resolver(() => ParticipantStatus)
export class ParticipantStatusResolver {

}
