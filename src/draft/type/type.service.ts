import { Injectable } from '@nestjs/common';
import {PrismaService} from "../../prisma/prisma.service";
import {EventStatus, EventType} from "@prisma/client";


@Injectable()
export class TypeService {
  constructor(private prisma: PrismaService) {
  }


  findAll() {
    return Object.keys(EventType)
  }

}
