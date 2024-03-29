import {Injectable, Logger} from '@nestjs/common';

import {PrismaService} from "../prisma/prisma.service";
import {Location, Prisma} from '@prisma/client';

@Injectable()
export class LocationService {
  private readonly logger = new Logger(LocationService.name)
  constructor(private prisma: PrismaService) {
  }
  create(createLocationInput: Prisma.LocationCreateInput):Promise<Location> {
    return this.prisma.location.create({data:createLocationInput})
  }

  findAll() {
    return this.prisma.location.findMany({})
  }

  findOne(id: number) {
    return this.prisma.location.findUnique({
      where:{
        id:id
      }
    })
  }

}
