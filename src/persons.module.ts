import { Module } from '@nestjs/common';
import {PersonsRepository} from "./persons.repository";
import {PrismaModule} from "./prisma/prisma.module";
import {PersonsService} from "./persons.service";


@Module({
    imports:[PrismaModule],
    providers: [PersonsRepository, PersonsService],
    exports:[PersonsService]
})
export class PersonsModule {}