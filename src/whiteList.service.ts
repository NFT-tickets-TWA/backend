import { Injectable } from '@nestjs/common';
import { Person, Prisma } from '@prisma/client';
import { PrismaService } from './prisma.service';
import {PersonDTO, WhiteListDTO} from "./event";

@Injectable()
export class WhiteListService {
    constructor(private prisma: PrismaService) {}

    async register(data: WhiteListDTO):Promise<WhiteListDTO>{
        return this.prisma.whiteList.create({data});
    }
}
