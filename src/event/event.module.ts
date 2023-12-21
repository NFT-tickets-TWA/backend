import {forwardRef, Module} from '@nestjs/common';
import { EventService } from './event.service';
import { EventResolver } from './event.resolver';
import {PrismaModule} from "../prisma/prisma.module";
import {ParticipantListModule} from "../participant-list/participant-list.module";
import {ParticipantListService} from "../participant-list/participant-list.service";

@Module({
  imports:[PrismaModule, forwardRef(() => ParticipantListModule)],
  providers: [EventResolver, EventService],
  exports:[EventService]
})
export class EventModule {}
