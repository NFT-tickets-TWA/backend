import { Injectable } from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {EventStatus} from "@prisma/client";



@Injectable()
export class StatusService {
  constructor(private prisma: PrismaService) {
  }

  findAll() {
    return Object.keys(EventStatus)
  }



}
