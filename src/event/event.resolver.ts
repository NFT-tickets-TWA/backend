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
    @Mutation(() => Event, {description: "создание мероприятия"})
    createEvent(@Args('input') createEventInput: CreateEventInput,@Args('tgID', {description:"телеграмм id создателя мероприятия"}) tgID: string, @Relations() relations: { select: Prisma.EventSelect }) {
        return this.eventService.createEvent(createEventInput,tgID, relations);
    }

    @Query(() => [Event], {name: 'eventCollection', description: "получение всех мероприятий"})
    findAll(@Relations() relations: { select: Prisma.EventSelect }) {
        return this.eventService.findAll(relations);
    }

    @Query(() => Event, {name: 'eventByID', description: "получение мероприятия по его id"})
    findOneByID(@Args('id', {type: () => Int}) id: number, @Relations() relations: { select: Prisma.EventSelect }) {
        return this.eventService.findOneByID(id, relations);
    }

    @Query(() => [Event], {name: 'eventCollectionByTG', description: "получение мероприятий по телеграмм id создателя"})
    findOneByTG(@Args('tgID', {type: () => String}) tgID: string, @Relations() relations: { select: Prisma.EventSelect }) {
        return this.eventService.findManyByTG(tgID, relations);
    }

    @Query(() => Event, {name: 'eventByLink', description: "получение мероприятия по подтверждающей участие ссылке"})
    findOneByLink(@Args('link', {type: () => String}) link: string, @Relations() relations: { select: Prisma.EventSelect }) {
        return this.eventService.findOneByLink(link, relations);
    }

    @Query(() => [Event], {name: 'eventCollectionByName', description: "получение всех мероприятий с данным именем"})
    findOneByName(@Args('name', {type: () => String}) name: string, @Relations() relations: { select: Prisma.EventSelect }) {
        return this.eventService.findManyByName(name, relations,);
    }

    @Mutation(() => Event, {description: "добавление подтверждающей ссылки"})
    addApproveLink(@Args('eventID') eventID: number, @Args('approveLink') approveLink: string, @Relations() relations: { select: Prisma.EventSelect }) {
        return this.eventService.addApproveLink(eventID, approveLink, relations);
    }

}
