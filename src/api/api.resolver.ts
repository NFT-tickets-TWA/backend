import {Args, Int, Mutation, Query, Resolver} from "@nestjs/graphql";
import {Person} from "../persons.model";
import {PersonsService} from "../persons.service";


@Resolver(of => Person)
export class ApiResolver {
    constructor(private readonly personsService: PersonsService) {
    }

    @Query(() => [Person])
    async getPerson() {
        return this.personsService.getPerson();
    }

    @Mutation(() => Person)
    async createPerson(
        @Args({name: `walletAddress`, type: () => String}) walletAddress: string,
        @Args({name: `tgId`, type: () => String}) tgId: string,
        @Args({name: `roleID`, type: () => Int}) roleID: number,
    ) {
        return this.personsService.createTweet({walletAddress, tgId, roleID});
    }
}