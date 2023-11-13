import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaService } from './prisma.service';

import AdminModule from './admin.module';
import { PersonService } from './person.service';
import { EventService } from './event.service';

@Module({
  imports: [AdminModule],
  controllers: [AppController],
  providers: [PrismaService, PersonService, EventService],
})
export class AppModule {}
