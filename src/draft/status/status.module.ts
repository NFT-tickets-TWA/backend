import { Module } from '@nestjs/common';
import { StatusService } from './status.service';
import { StatusResolver } from './status.resolver';
import {PrismaModule} from "../../prisma/prisma.module";

@Module({
  imports:[PrismaModule],
  providers: [StatusResolver, StatusService],
  exports:[StatusService]
})
export class StatusModule {}
