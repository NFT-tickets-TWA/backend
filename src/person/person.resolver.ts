import {Resolver, Query, Mutation, Args, Int} from '@nestjs/graphql';
import {PersonService} from './person.service';
import {Person} from './entities/person.entity';
import {Relations} from "../rest/util/responses";
import {Prisma} from "@prisma/client";

@Resolver(() => Person)
export class PersonResolver {
    constructor(private readonly personService: PersonService) {
    }

    @Mutation(() => Person)
    createPerson(@Args({name: `walletAddress`, type: () => String}) walletAddress: string,
                 @Args({name: `tgID`, type: () => String}) tgID: string, @Relations() relations: { select: Prisma.PersonSelect }) {

        return this.personService.create({
            data: {
                walletAddress,
                tgID
            },
        }, relations);

    }

    @Query(() => Person, {name: 'personByID'})
    findOne(@Args('id', {type: () => Int}) id: number, @Relations() relations: { select: Prisma.PersonSelect }) {
        return this.personService.findOne(id, relations);
    }
    @Query(() => Person, {name: 'personByTgID'})
    findOneByTg(@Args('tgID', {type: () => String}) id: string, @Relations() relations: { select: Prisma.PersonSelect }) {
        return this.personService.findOneByTg(id, relations);
    }

}
