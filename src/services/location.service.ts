import {Injectable} from "@nestjs/common";
import {PrismaService} from "./prisma.service";
import {LocationDTO} from "../stractures/stractures";

@Injectable()
export class LocationService {
    constructor(private prisma: PrismaService) {
    }
    async createLocation(data: LocationDTO){
        console.log("request: create location")
        return this.prisma.location.create({data});
    }
    async getLocations(): Promise<LocationDTO[]>{
        console.log("request: get locations")
        return this.prisma.location.findMany();
    }
}