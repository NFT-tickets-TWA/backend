import {Resolver, Query, Mutation, Args, Int} from '@nestjs/graphql';
import {EventService} from './event.service';
import {Event} from './entities/event.entity';
import {CreateEventInput} from './dto/create-event.input';
import {Relations} from "../rest/util/responses";
import {Prisma} from '@prisma/client';
import {FindUniqueEventOrThrowArgs} from "./dto/find-unique-event-or-throw.args";
import {FindManyEventArgs} from "./dto/find-many-event.args";

@Resolver(() => Event)
export class EventResolver {
    constructor(private readonly eventService: EventService) {
    }
    @Mutation(() => Event, {description: "создание мероприятия"})
    createEvent(@Args('input') createEventInput: CreateEventInput,@Args('tgID', {description:"телеграмм id создателя мероприятия"}) tgID: string, @Relations() relations: { select: Prisma.EventSelect }) {
        return this.eventService.createEvent(createEventInput,tgID, relations);
    }

    @Query(() => Event, {name: 'event', description: "получение мероприятия по его характеристикам", nullable:true})
    findOne(@Relations() relations: { select: Prisma.EventSelect }, @Args() args: FindUniqueEventOrThrowArgs) {
        return this.eventService.findOne(args, relations);
    }

    @Query(() => [Event], {name: 'eventCollection', description: "получение мероприятиий по его характеристикам"})
    findMany(@Args() whereArgs: FindManyEventArgs, @Relations() relations: { select: Prisma.EventSelect }) {
        return this.eventService.findMany(whereArgs, relations);
    }

    @Mutation(() => Event, {description: "добавление подтверждающей ссылки"})
    addApproveLink(@Args('eventID') eventID: number, @Args('approveLink') approveLink: string, @Relations() relations: { select: Prisma.EventSelect }) {
        return this.eventService.addApproveLink(eventID, approveLink, relations);
    }

}
