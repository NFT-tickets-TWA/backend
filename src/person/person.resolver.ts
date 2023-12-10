import {Resolver, Query, Mutation, Args, Int} from '@nestjs/graphql';
import {PersonService} from './person.service';
import {Person} from './entities/person.entity';
import {Prisma} from "@prisma/client";

@Resolver(() => Person)
export class PersonResolver {
    constructor(private readonly personService: PersonService) {
    }

    @Mutation(() => Person)
    createPerson(@Args({name: `walletAddress`, type: () => String}) walletAddress: string,
                 @Args({name: `tgId`, type: () => String}) tgId: string) {

        return this.personService.create({
            data: {
                walletAddress,
                tgId
            },
        });

    }

    @Query(() => Person, {name: 'person'})
    findOne(@Args('id', {type: () => Int}) id: number) {
        return this.personService.findOne(id);
    }
    @Query(() => Person, {name: 'person'})
    findOneByTg(@Args('tgID', {type: () => Int}) id: string) {
        return this.personService.findOneByTg(id);
    }

}
