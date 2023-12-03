import {Injectable} from "@nestjs/common";
import {PrismaService} from "./prisma.service";
import {LocationDTO} from "../stractures/stractures";

@Injectable()
export class LocationService {
    constructor(private prisma: PrismaService) {
    }
    async createLocation(data: LocationDTO){
        return this.prisma.location.create({data});
    }
    async getLocations(): Promise<LocationDTO[]>{
        return this.prisma.location.findMany();
    }
}