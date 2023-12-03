import {Injectable} from "@nestjs/common";
import {PrismaService} from "./prisma.service";
import {EventStatusDTO, LocationDTO} from "../stractures/stractures";

@Injectable()
export class StatusEventService {
    constructor(private prisma: PrismaService) {
    }
    async getStatusEvents(): Promise<EventStatusDTO[]>{
        return this.prisma.eventStatus.findMany({
            select:{
                status:true
            }
        });
    }
}