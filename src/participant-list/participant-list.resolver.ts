import {Resolver, Query, Mutation, Args, Field, Int} from '@nestjs/graphql';
import {ParticipantListService} from './participant-list.service';
import {ParticipantList} from './entities/participant-list.entity';
import {CreateParticipantListInput} from './dto/create-participant-list.input';
import {Relations} from "../util/util";
import {Prisma} from "@prisma/client";


@Resolver(() => ParticipantList)
export class ParticipantListResolver {
    constructor(private readonly participantListService: ParticipantListService) {
    }

    @Mutation(() => ParticipantList, {name: 'register', description: "регистрация человека на мероприятие"})
    createParticipantList(@Args("personID") personID: number,
                          @Args("eventID") eventID: number, @Relations() relations: {
            select: Prisma.ParticipantListSelect
        }) {
        return this.participantListService.create(personID,eventID, relations);
    }

    @Query(() => String, {name: 'status', description: "получение статуса участника на данном мероприятии"})
    getCurrentStatus(@Args('input') input: CreateParticipantListInput) {
        return this.participantListService.getCurrentStatus(input.personID, input.eventID);
    }

    @Mutation(() => ParticipantList, {name: 'approve', description: "подтверждение участия участника в мероприятии"})
    approve(@Args('input') input: CreateParticipantListInput) {
        return this.participantListService.approve(input.personID, input.eventID);
    }

}
