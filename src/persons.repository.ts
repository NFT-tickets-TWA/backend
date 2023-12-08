import { Injectable } from '@nestjs/common';
import { Prisma, Person } from '@prisma/client';
import {PrismaService} from "./prisma/prisma.service";


@Injectable()
export class PersonsRepository {
    constructor(private prisma: PrismaService) {}

    async createPerson(params: { data: Prisma.PersonCreateInput }): Promise<Person> {
        const { data } = params;
        return this.prisma.person.create({ data });
    }

    async getPersons(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.PersonWhereUniqueInput;
        where?: Prisma.PersonWhereInput;
        orderBy?: Prisma.PersonOrderByWithRelationInput;
    }): Promise<Person[]> {
        const { skip, take, cursor, where, orderBy } = params;
        return this.prisma.person.findMany({ skip, take, cursor, where, orderBy });
    }

}

