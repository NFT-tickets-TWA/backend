import {Module} from '@nestjs/common';
import {PersonService} from './person.service';
import {PersonResolver} from './person.resolver';
import {PrismaModule} from "../prisma/prisma.module";


@Module({
    imports:[PrismaModule],
    providers: [PersonResolver, PersonService],
    exports:[PersonService]
})
export class PersonModule {
}
