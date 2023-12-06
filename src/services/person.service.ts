import { Injectable } from '@nestjs/common';
import { Person, Prisma } from '@prisma/client';
import { PrismaService } from './prisma.service';
import {PersonDTO} from "../stractures/stractures";

@Injectable()
export class PersonService {
  constructor(private prisma: PrismaService) {}

  async persons(): Promise<Person[]> {
    return this.prisma.person.findMany();
  }

  async createPerson(data: PersonDTO): Promise<Person> {
    return this.prisma.person.create({ data });
  }
  async getPersonByTgId(tg: string):Promise<Person>{
    return this.prisma.person.findUniqueOrThrow({
      where: {
        tgId:tg
      }
    })
  }
  async getRoleByIDPerson(tg: string){
    console.log(tg);
    return this.prisma.person.findMany(
        {
          where:{
            tgId:tg
          },
          select:{
            id: true,
            walletAddress:true,
            roles:{
              select:{
                role:{
                  select:{
                    name:true
                  }
                }
              }
            }
          }
        }
    )

  }
}
