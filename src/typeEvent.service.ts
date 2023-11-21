import {Injectable} from "@nestjs/common";
import {PrismaService} from "./prisma.service";
import {EventStatusDTO, EventTypeDTO} from "./event";

@Injectable()
export class TypeEventService {
    constructor(private prisma: PrismaService) {
    }
    async getTypeEvents(): Promise<EventTypeDTO[]>{
        return this.prisma.eventType.findMany({
            select:{
                type:true
            }
        });
    }
}