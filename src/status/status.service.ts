import { Injectable } from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";


@Injectable()
export class StatusService {
  constructor(private prisma: PrismaService) {
  }

  findAll() {
    return this.prisma.eventStatus.findMany({})
  }

  findOne(id: number) {
    return this.prisma.eventStatus.findUnique({
      where:{
        id:id
      }
    })
  }


}
