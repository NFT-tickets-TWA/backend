import { Module } from '@nestjs/common';
import { ParticipantStatusService } from './participant-status.service';
import { ParticipantStatusResolver } from './participant-status.resolver';

@Module({
  providers: [ParticipantStatusResolver, ParticipantStatusService],
})
export class ParticipantStatusModule {}
