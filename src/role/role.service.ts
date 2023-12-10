import { Injectable } from '@nestjs/common';

import {PrismaService} from "../prisma/prisma.service";

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {
  }

  findAll() {
    return this.prisma.role.findMany({});
  }

  findOne(id: number) {
    return this.prisma.role.findUnique({
      where:{
        id:id
      }
    })
  }

}
