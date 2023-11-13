import { Injectable } from '@nestjs/common';
import { Event, Prisma } from '@prisma/client';
import { PrismaService } from './prisma.service';

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {}

  async events() {
    return this.prisma.event.findMany();
  }

  async createEvent(data: Event): Promise<Event> {
    return this.prisma.event.create({ data });
  }
}
