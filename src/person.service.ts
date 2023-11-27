import { Injectable } from '@nestjs/common';
import { Person, Prisma } from '@prisma/client';
import { PrismaService } from './prisma.service';
import {PersonDTO} from "./event";

@Injectable()
export class PersonService {
  constructor(private prisma: PrismaService) {}

  async persons(): Promise<Person[]> {
    return this.prisma.person.findMany();
  }

  async createPerson(data: PersonDTO): Promise<Person> {
    return this.prisma.person.create({ data });
  }
  async getPersonByTgId(tg: number):Promise<Person>{
    return this.prisma.person.findUniqueOrThrow({
      where: {
        tgId:tg
      }
    })
  }
  async getRoleByIDPerson(tg: string){
    console.log(tg);
    return  this.prisma.$queryRaw(
        Prisma.sql`SELECT walletAddress, name as role FROM Person left join UserRole on Person.id=UserRole.personID left join Role on UserRole.roleID=Role.id WHERE tgId = ${tg}`
    )
  }
}
