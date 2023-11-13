import { Injectable } from '@nestjs/common';
import { Person, Prisma } from '@prisma/client';
import { PrismaService } from './prisma.service';

@Injectable()
export class PersonService {
  constructor(private prisma: PrismaService) {}

  async persons(): Promise<Person[]> {
    return this.prisma.person.findMany();
  }

  async createPerson(data: Prisma.PersonCreateInput): Promise<Person> {
    return this.prisma.person.create({ data });
  }
}
