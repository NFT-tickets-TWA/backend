import { Injectable } from '@nestjs/common';
import { Event, Prisma } from '@prisma/client';
import { PrismaService } from './prisma.service';
import {EventDTO, EventDTOResponse} from "./event";
import {toNumber} from "ethers";

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {}

  async events():Promise<EventDTOResponse[]> {
    return this.prisma.event.findMany();
  }
  async updateCollectionAdr(id:number, adr:string){
    return this.prisma.event.update({
      where: {id:id},
      data:{collectionAddr: adr},
    })
  }
  async delete(id:number){
    return this.prisma.event.delete({
      where: {id:id}
    })
  }


  async createEvent(data: EventDTO): Promise<EventDTOResponse> {
    console.log(data)
    return this.prisma.event.create({ data });
  }
  async getEventsByTgId(tgID: string){
    return  this.prisma.$queryRaw(
        Prisma.sql`SELECT * FROM Event where Event.creatorID= (select id from Person where tgId=${tgID})`
    )
  }
  async getEventsByName(name: string){
    console.log("get events by name " + name)
    return this.prisma.event.findMany(
        {
          where:{
            name:name
          }
        }
    )
  }
  async getEventByID(id: number){
    console.log("get event by id " + id)
    return this.prisma.event.findUnique(
        {
          where:{
            id:toNumber(id)
          }
        }
    )
  }
}
