import { Injectable } from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";


@Injectable()
export class TypeService {
  constructor(private prisma: PrismaService) {
  }


  findAll() {
    return this.prisma.eventType.findMany({});
  }

  findOne(id: number) {
    return this.prisma.eventType.findUnique({
      where:{
        id:id
      }
    })
  }

}
