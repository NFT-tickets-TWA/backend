import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationResolver } from './location.resolver';
import {PrismaModule} from "../prisma/prisma.module";

@Module({
  imports:[PrismaModule],
  providers: [LocationResolver, LocationService],
  exports:[LocationService]
})
export class LocationModule {}
