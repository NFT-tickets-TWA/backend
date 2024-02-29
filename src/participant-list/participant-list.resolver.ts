import {Resolver, Query, Mutation, Args, Field, Int} from '@nestjs/graphql';
import {ParticipantListService} from './participant-list.service';
import {ParticipantList} from './entities/participant-list.entity';
import {CreateParticipantListInput} from './dto/create-participant-list.input';
import {Relations} from "../util/util";
import {Prisma} from "@prisma/client";
import {Logger} from "@nestjs/common";


@Resolver(() => ParticipantList)
export class ParticipantListResolver {
    private readonly logger = new Logger(ParticipantListResolver.name)
    constructor(private readonly participantListService: ParticipantListService) {
    }

    @Mutation(() => ParticipantList, {name: 'register', description: "регистрация человека на мероприятие"})
    createParticipantList(@Args("personID", { type: () => Int }) personID: number,
                          @Args("eventID", { type: () => Int }) eventID: number, @Relations() relations: {
            select: Prisma.ParticipantListSelect
        }) {
        this.logger.log("create participant list request")
        return this.participantListService.create(personID,eventID, relations);
    }

    @Query(() => String, {name: 'status', description: "получение статуса участника на данном мероприятии"})
    getCurrentStatus(@Args('input') input: CreateParticipantListInput) {
        this.logger.log("get participant status request")
        return this.participantListService.getCurrentStatus(input.personID, input.eventID);
    }

    @Mutation(() => ParticipantList, {name: 'approve', description: "подтверждение участия участника в мероприятии"})
    approve(@Args("personID", { type: () => Int }) personID: number,
            @Args("eventID", { type: () => Int }) eventID: number) {
        this.logger.log("approve participant request")
        return this.participantListService.approveParticipant(personID, eventID);
    }

}
