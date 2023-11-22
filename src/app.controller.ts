import {
    Controller,
    Get,
    Param,
    Post,
    Body,
    Put,
    Delete, Res,
} from '@nestjs/common';

import {EventService} from './event.service';
import {PersonService} from './person.service';
import {LocationService} from "./location.service";
import {StatusEventService} from "./statusEvent.service";
import {TypeEventService} from "./typeEvent.service";
import {Response} from "express";
import {createInternalEvent} from "./contract";
import {
    ContractEvent,
    convertEventDTORequestToEventDTO,
    EventDTO,
    EventDTOResponse,
    EventDTORequest,
    PersonDTO, LocationDTO, EventTypeDTO, EventStatusDTO
} from "./event";
import {ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";


@Controller('api')
@ApiTags("API")
export class AppController {
    constructor(
        private readonly eventService: EventService,
        private readonly personService: PersonService,
        private readonly locationService: LocationService,
        private readonly typeEventService: TypeEventService,
        private readonly statusEventService: StatusEventService,
    ) {
    }

    @Get('events')
    @ApiOperation({summary: "returns all events in database"})
    @ApiOkResponse({type: EventDTOResponse, isArray: true, description: "array of events"})
    async getEvents() {
        return this.eventService.events();
    }

    generateSymbol(): string {
        const symbols = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let result = '';
        for (let i = 0; i < 3; i++) {
            result += symbols.charAt(Math.floor(Math.random() * symbols.length));
        }
        return result;
    }

    @Post('event')
    @ApiOperation({summary: "create event contract and add it to the database"})
    @ApiOkResponse({type: Number, description: "return id of created event"})
    @ApiBadRequestResponse({type: String, description: "return error message"})
    @ApiResponse({status:500, type: String, description: "return error"})
    async createEvent(@Body() eventDataRequest: EventDTORequest, @Res() res: Response) {
        console.log(eventDataRequest)
        const contractEvent = new ContractEvent(eventDataRequest.name, eventDataRequest.nftIPFSurl, this.generateSymbol(), eventDataRequest.countOfRewardTokens, eventDataRequest.SBTState);
        const id = this.personService.getPersonByTgId(eventDataRequest.creatorTgId).then(
            (person) => {
                const eventData = convertEventDTORequestToEventDTO(eventDataRequest, person.id)
                this.eventService.createEvent(eventData).then((data) => {
                        createInternalEvent(contractEvent).then((response) => {
                            if (response.status == 200) {
                                this.eventService.updateCollectionAdr(data.id, response.hash).then(() => {
                                        return res.status(200).json(data.id);
                                    }
                                ).catch((error) => {
                                    console.log(error)
                                    return res.status(500).json("impossible to update collection address")
                                })

                            } else {
                                this.eventService.delete(data.id).then(() => {
                                        return res.status(response.status).json(response.message);
                                    }
                                ).catch((error) => {
                                    console.log(error)
                                    return res.status(response.status).json(response.message + "impossible to delete invalid event, please contact admin")
                                })
                            }
                        }).catch((error) => {
                            console.log(error)
                            return res.status(400).json(error)
                        })
                    }
                ).catch((err) => {
                    console.log(err)
                    switch (err.code) {
                        case 'P2002':
                            return res.status(400).json(`Duplicate field value: ${err.meta.target}`)
                        case 'P2003':
                            return res.status(400).json(`Foreign key constraint failed`)
                        default:
                            return res.status(500).json(`Something went wrong: ${err.message}`)
                    }
                })
            }
        ).catch(
            (error) => {
                console.log(error)
                return res.status(400).json(error)
            }
        )


    }

    @Post('person')
    @ApiOperation({summary: "create person"})
    @ApiOkResponse({type: Number, description: "return id of created person"})
    @ApiResponse({status:500, type: String, description: "return error"})
    async createPerson(@Body() person: PersonDTO, @Res() res: Response) {
        console.log("create person")
        this.personService.createPerson(person).then(
            (data) => {
                return res.status(200).json(data.id)
            }
        ).catch(
            (e) => {
                return res.status(500).json(e.json)
            }
        )
    }

    @Get('person_by_tg/:id')
    @ApiOperation({summary: "get person and his roles by tg if no role return null"})
    @ApiOkResponse({
        schema: {
            example: [
                {
                    walletAddress: 'address',
                    role: "ADMIN"
                },
                {
                    walletAddress: 'address',
                    role: "USER"
                }
            ]

        }, isArray: true, description: "return array with wallet address and his roles"
    })
    @ApiBadRequestResponse({type: String, description: "return error"})
    @ApiResponse({status:500, type: String, description: "return error"})
    async getPersonById(@Param('id') id: string, @Res() res: Response) {
        console.log("person with role by tg id")
        this.personService.getRoleByIDPerson(id).then(
            (data) => {
                return res.status(200).json(data)
            }
        ).catch(
            (e) => {
                console.log(e)
                return res.status(500).json(e)
            }
        )
    }

    @Get('events_by_tg/:id')
    @ApiOperation({summary: "get events by user telegram id"})
    @ApiOkResponse({
        isArray: true, description: "return array of events"
    })
    @ApiBadRequestResponse({type: String, description: "return error"})
    @ApiResponse({status:500, type: String, description: "return error"})
    async getEventsById(@Param('id') id: string, @Res() res: Response) {
        console.log("events created by tg id user")
        this.eventService.getEventsByTgId(id).then(
            (data) => {
                return res.status(200).json(data)
            }
        ).catch(
            (e) => {
                console.log(e)
                return res.status(500).json(e)
            }
        )
    }

    @Get('events_by_name/:name')
    @ApiOperation({summary: "get events by name"})
    @ApiOkResponse({
        isArray: true, type: EventDTOResponse, description: "return array of events"
    })
    @ApiBadRequestResponse({type: String, description: "return error"})
    @ApiResponse({status:500, type: String, description: "return error"})
    async getEventsByName(@Param('name') name: string, @Res() res: Response) {
        console.log("request")
        this.eventService.getEventsByName(name).then(
            (data) => {
                return res.status(200).json(data)
            }
        ).catch(
            (e) => {
                console.log(e)
                return res.status(500).json(e)
            }
        )
    }
    @Get('event_by_id/:id')
    @ApiOperation({summary: "get event by id"})
    @ApiOkResponse({type: EventDTOResponse, description: "return an event or null"})
    @ApiBadRequestResponse({type: String, description: "return error"})
    @ApiResponse({status:500, type: String, description: "return error"})
    async getEventByID(@Param('id') id: number, @Res() res: Response) {
        console.log("request")
        this.eventService.getEventByID(id).then(
            (data) => {
                return res.status(200).json(data)
            }
        ).catch(
            (e) => {
                console.log(e)
                return res.status(500).json(e)
            }
        )
    }

    @Get('locations')
    @ApiOperation({summary: "get locations"})
    @ApiOkResponse({
        isArray: true, type: LocationDTO, description: "return array of locations"
    })
    @ApiBadRequestResponse({type: String, description: "return error"})
    @ApiResponse({status:500, type: String, description: "return error"})
    async getLocations(@Res() res: Response) {
        console.log("request")
        this.locationService.getLocations().then(
            (data) => {
                return res.status(200).json(data)
            }
        ).catch(
            (e) => {
                console.log(e)
                return res.status(500).json(e)
            }
        )
    }

    @Get('types')
    @ApiOperation({summary: "get types"})
    @ApiOkResponse({isArray: true, type: EventTypeDTO, description: "return array of types"})
    @ApiBadRequestResponse({type: String, description: "return error"})
    @ApiResponse({status:500, type: String, description: "return error"})
    async getTypes(@Res() res: Response) {
        console.log("request")
        this.typeEventService.getTypeEvents().then(
            (data) => {
                return res.status(200).json(data)
            }
        ).catch(
            (e) => {
                console.log(e)
                return res.status(500).json(e)
            }
        )
    }

    @Get('statuses')
    @ApiOperation({summary: "get statuses of event"})
    @ApiOkResponse({isArray: true, type: EventStatusDTO, description: "return array of statuses"})
    @ApiBadRequestResponse({type: String, description: "return error"})
    @ApiResponse({status:500, type: String, description: "return error"})
    async getStatuses(@Res() res: Response) {
        console.log("request")
        this.statusEventService.getStatusEvents().then(
            (data) => {
                return res.status(200).json(data)
            }
        ).catch(
            (e) => {
                console.log(e)
                return res.status(500).json(e)
            }
        )
    }
}
