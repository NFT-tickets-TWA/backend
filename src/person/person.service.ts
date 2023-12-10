import {Injectable} from '@nestjs/common';
import {Person, Prisma} from "@prisma/client";
import {PrismaService} from "../prisma/prisma.service";

@Injectable()
export class PersonService {
    constructor(private prisma: PrismaService) {
    }

    async create(params: { data: Prisma.PersonCreateInput }): Promise<Person> {
        const { data } = params;
        return this.prisma.person.create({ data });
    }

    findOne(id: number) {
        return this.prisma.person.findUnique({
            where: {
                id: id
            }
        });
    }
    findOneByTg(id: string) {
        return this.prisma.person.findUnique({
            where: {
                tgId: id
            }
        });
    }

}
