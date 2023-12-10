import { Module } from '@nestjs/common';
import { ParticipantListService } from './participant-list.service';
import { ParticipantListResolver } from './participant-list.resolver';
import {PrismaModule} from "../prisma/prisma.module";
import {EventModule} from "../event/event.module";

@Module({
  imports:[PrismaModule, EventModule],
  providers: [ParticipantListResolver, ParticipantListService],
  exports:[ParticipantListService]
})
export class ParticipantListModule {}
