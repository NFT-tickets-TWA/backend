import {Resolver, Query, Mutation, Args, Int} from '@nestjs/graphql';
import {EventService} from './event.service';
import {Event} from './entities/event.entity';
import {CreateEventInput} from './dto/create-event.input';
import {Relations} from "../rest/util/responses";
import {Prisma} from '@prisma/client';

@Resolver(() => Event)
export class EventResolver {
    constructor(private readonly eventService: EventService) {
    }
    @Mutation(() => Event)
    createEvent(@Args('input') createEventInput: CreateEventInput,@Args('tgID') tgID: string, @Relations() relations: { select: Prisma.EventSelect }) {
        console.log("hh")
        return this.eventService.createEvent(createEventInput,tgID, relations);
    }

    @Query(() => [Event], {name: 'events'})
    findAll(@Relations() relations: { select: Prisma.EventSelect }) {
        return this.eventService.findAll(relations);
    }

    @Query(() => Event, {name: 'event'})
    findOneByID(@Args('id', {type: () => Int}) id: number, @Relations() relations: { select: Prisma.EventSelect }) {
        return this.eventService.findOneByID(id, relations);
    }

    @Query(() => [Event], {name: 'eventsTG'})
    findOneByTG(@Args('tgID', {type: () => String}) tgID: string, @Relations() relations: { select: Prisma.EventSelect }) {
        return this.eventService.findManyByTG(tgID, relations
        );
    }

    @Query(() => Event, {name: 'eventLink'})
    findOneByLink(@Args('link', {type: () => String}) link: string, @Relations() relations: { select: Prisma.EventSelect }) {
        return this.eventService.findOneByLink(link, relations);
    }

    @Query(() => [Event], {name: 'eventsName'})
    findOneByName(@Args('name', {type: () => String}) name: string, @Relations() relations: { select: Prisma.EventSelect }) {
        return this.eventService.findManyByName(name, relations,);
    }

    @Mutation(() => Event)
    addApproveLink(@Args('eventID') eventID: number, @Args('approveLink') approveLink: string, @Relations() relations: { select: Prisma.EventSelect }) {
        return this.eventService.addApproveLink(eventID, approveLink, relations);
    }

}
