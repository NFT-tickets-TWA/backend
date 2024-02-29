import {Resolver, Query, Mutation, Args, Int} from '@nestjs/graphql';
import {EventService} from './event.service';
import {Event} from './entities/event.entity';
import {CreateEventInput} from './dto/create-event.input';
import {Relations} from "../util/util";
import {EventStatus, Prisma} from '@prisma/client';
import {FindUniqueEventOrThrowArgs} from "./dto/find-unique-event-or-throw.args";
import {FindManyEventArgs} from "./dto/find-many-event.args";
import {ParticipantList} from "../participant-list/entities/participant-list.entity";
import {AuthGuard} from "../jwt/jwt";
import {Logger, UseGuards} from "@nestjs/common";

@Resolver(() => Event)
export class EventResolver {
    private readonly logger = new Logger(EventResolver.name)
    constructor(private readonly eventService: EventService) {
    }

    @Mutation(() => Event, {description: "создание мероприятия"})
    // @UseGuards(AuthGuard)
    createEvent(@Args('input') createEventInput: CreateEventInput, @Args('tgID', {description: "телеграмм id создателя мероприятия"}) tgID: string, @Relations() relations: {
        select: Prisma.EventSelect
    }) {
        this.logger.log("create event request, tgID: " + tgID)
        return this.eventService.createEvent(createEventInput, tgID, relations);
    }

    @Query(() => Event, {name: 'event', description: "получение мероприятия по его характеристикам", nullable: true})
    findOne(@Args() whereArgs: FindUniqueEventOrThrowArgs, @Relations() relations: { select: Prisma.EventSelect }) {
        this.logger.log("find one request start, relations: " + relations)
        return this.eventService.findOne(whereArgs, relations);
    }

    @Query(() => [Event], {name: 'eventCollection', description: "получение мероприятий по его характеристикам"})
    findMany(@Args() whereArgs: FindManyEventArgs, @Relations() relations: { select: Prisma.EventSelect }) {
        this.logger.log("find many request start: " + whereArgs)
        return this.eventService.findMany(whereArgs, relations);
    }

    @Mutation(() => Event, {description: "добавление подтверждающей ссылки"})
    addApproveLink(@Args('eventID') eventID: number, @Args('approveLink') approveLink: string, @Relations() relations: {
        select: Prisma.EventSelect
    }) {
        this.logger.log("add approve link request start, eventID " + eventID)
        return this.eventService.addApproveLink(eventID, approveLink, relations);
    }

    @Mutation(() => [ParticipantList], {description: "mint nft для всех участников мероприятия"})
    mintNft(@Args('eventID') eventID: number) {
        this.logger.log("mint nft to all request start, eventID " + eventID)
        return this.eventService.mintNftAll(eventID);
    }

    @Mutation(() => ParticipantList, {description: "mint nft для участника мероприятия"})
    mintPersonNft(@Args('personID') personID: number, @Args('eventID') eventID: number) {
        this.logger.log("mint person nft request starts personID " + personID + "eventID" + eventID)
        return this.eventService.mintOne(personID, eventID);
    }

    @Mutation(() => Event, {description: "изменение статуса мероприятия"})
    updateStatus(@Args('eventID') eventID: number, @Args('newStatus') newStatus: EventStatus, @Relations() relations: {
        select: Prisma.EventSelect
    }) {
        this.logger.log("update event status request start, eventID ", eventID, " newStatus", newStatus)
        return this.eventService.updateStatus(eventID, newStatus, relations);
    }

}
