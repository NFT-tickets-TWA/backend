import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventResolver } from './event.resolver';
import {PrismaModule} from "../prisma/prisma.module";

@Module({
  imports:[PrismaModule],
  providers: [EventResolver, EventService],
  exports:[EventService]
})
export class EventModule {}
