import {Injectable} from '@nestjs/common';
import {Person, Prisma} from "@prisma/client";
import {PrismaService} from "../prisma/prisma.service";

@Injectable()
export class PersonService {
    constructor(private prisma: PrismaService) {
    }

    async create(params: { data: Prisma.PersonCreateInput }, args: { select: Prisma.PersonSelect }): Promise<Person> {
        const { data } = params;
        return this.prisma.person.create({ data:data, select: args.select });
    }

    findOne(id: number, args: { select: Prisma.PersonSelect }) {
        return this.prisma.person.findUnique({
            where: {
                id: id
            }, select: args.select
        });
    }
    findOneByTg(id: string, args: { select: Prisma.PersonSelect }) {
        return this.prisma.person.findUnique({
            where: {
                tgID: id
            }, select: args.select
        });
    }

}
