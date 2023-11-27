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
import {Prisma} from '@prisma/client';


@Controller('api')
@ApiTags("API")
export class AppController {
    private static readonly errorDescription:string = "Prisma Client throws a PrismaClientKnownRequestError exception if the query engine returns a known error related to the request - for example, a unique constraint violation." +
        "\n\nPrisma Client throws a PrismaClientUnknownRequestError exception if the query engine returns an error related to a request that does not have an error code." +
        "\n\nPrisma Client throws a PrismaClientValidationError exception if validation fails - for example:\n" +
        "\n" +
        "Missing field - for example, an empty data: {} property when creating a new record\n" +
        "Incorrect field type provided (for example, setting a Boolean field to \"Hello, I like cheese and gold!\")";
    constructor(
        private readonly eventService: EventService,
        private readonly personService: PersonService,
        private readonly locationService: LocationService,
        private readonly typeEventService: TypeEventService,
        private readonly statusEventService: StatusEventService,
    ) {}

    generateSymbol(): string {
        const symbols = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let result = '';
        for (let i = 0; i < 3; i++) {
            result += symbols.charAt(Math.floor(Math.random() * symbols.length));
        }
        return result;
    }

    @Get('events')
    @ApiOperation({summary: "returns all events in database"})
    @ApiOkResponse({type: EventDTOResponse, isArray: true, description: "array of events"})
    @ApiResponse({
        status: 400,
        schema: {example: {message: 'message'}},
        description: AppController.errorDescription})
    @ApiResponse({
        status: 500,
        schema: {example: {message: 'message'}},
        description: "returns error message if PrismaClientRustPanicError, PrismaClientInitializationError, or smth unknown else"
    })
    async getEvents(@Res() res: Response) {
        return this.eventService.events().catch((error) => {
            this.handlePrismaError(error, res);
        })
    }


    @Post('event')
    @ApiOperation({summary: "create event contract and add it to the database"})
    @ApiOkResponse({type: Number, description: "return id of created event"})
    @ApiResponse({
        status: 400,
        schema: {example: {message: 'message'}},
        description:  AppController.errorDescription})
    @ApiResponse({
        status: 500,
        schema: {example: {message: 'message'}},
        description: "returns error message if PrismaClientRustPanicError, PrismaClientInitializationError, or smth unknown else"
    })
    async createEvent(@Body() eventDataRequest: EventDTORequest, @Res() res: Response) {
        console.log(eventDataRequest)
        const contractEvent = new ContractEvent(eventDataRequest.name, eventDataRequest.nftIPFSurl, this.generateSymbol(), eventDataRequest.countOfRewardTokens, eventDataRequest.isSBT);
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
                                    return res.status(500).json({message: "impossible to update collection address"})
                                })

                            } else {
                                this.eventService.delete(data.id).then(() => {
                                        return res.status(response.status).json({message: response.message});
                                    }
                                ).catch((error) => {
                                    console.log(error)
                                    return res.status(response.status).json({message: response.message + "impossible to delete invalid event, please contact admin"})
                                })
                            }
                        }).catch((error) => {
                            console.log(error)
                            return res.status(400).json({message: error})
                        })
                    }
                ).catch((error) => {
                    this.handlePrismaError(error, res);
                })
            }
        ).catch((error) => {
            this.handlePrismaError(error, res);
        })


    }

    @Post('person')
    @ApiOperation({summary: "create person"})
    @ApiOkResponse({type: Number, description: "return id of created person"})
    @ApiResponse({status: 400,
        schema: {example: {message: 'message'}},
        description: AppController.errorDescription
    })
    @ApiResponse({
        status: 500,
        schema: {example: {message: 'message'}},
        description: "returns error message if PrismaClientRustPanicError, PrismaClientInitializationError, or smth unknown else"
    })
    async createPerson(@Body() person: PersonDTO, @Res() res: Response) {
        console.log("create person")
        this.personService.createPerson(person).then(
            (data) => {
                return res.status(200).json(data.id)
            }
        ).catch((error) => {
            this.handlePrismaError(error, res);
        })
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

        },
        isArray: true,
        description: "returns error message if PrismaClientRustPanicError, PrismaClientInitializationError, or smth unknown else"
    })
    @ApiResponse({
        status: 400,
        schema: {
            example:
                {
                    message: 'message'
                }

        }, description:  AppController.errorDescription})
    @ApiResponse({
        status: 500,
        schema: {
            example:
                {
                    message: 'message'
                }

        },
        description: "returns error message if PrismaClientRustPanicError, PrismaClientInitializationError, or smth unknown else"
    })
    async getPersonById(@Param('id') id: string, @Res() res: Response) {
        console.log("person with role by tg id")
        this.personService.getRoleByIDPerson(id).then(
            (data) => {
                return res.status(200).json(data)
            }
        ).catch((error) => {
            this.handlePrismaError(error, res);
        })
    }

    @Get('events_by_tg/:id')
    @ApiOperation({summary: "get events by user telegram id"})
    @ApiOkResponse({
        isArray: true, description: "return array of events"
    })
    @ApiResponse({
        status: 400,
        schema: {
            example:
                {
                    message: 'message'
                }

        }, description:  AppController.errorDescription})
    @ApiResponse({
        status: 500,
        schema: {
            example:
                {
                    message: 'message'
                }

        },
        description: "returns error message if PrismaClientRustPanicError, PrismaClientInitializationError, or smth unknown else"
    })
    async getEventsById(@Param('id') id: string, @Res() res: Response) {
        console.log("events created by tg id user")
        this.eventService.getEventsByTgId(id).then(
            (data) => {
                return res.status(200).json(data)
            }
        ).catch((error) => {
            this.handlePrismaError(error, res);
        })
    }

    @Get('events_by_name/:name')
    @ApiOperation({summary: "get events by name"})
    @ApiOkResponse({
        isArray: true, type: EventDTOResponse, description: "return array of events"
    })
    @ApiResponse({
        status: 400,
        schema: {
            example:
                {
                    message: 'message'
                }

        }, description:  AppController.errorDescription})
    @ApiResponse({
        status: 500,
        schema: {
            example:
                {
                    message: 'message'
                }

        },
        description: "returns error message if PrismaClientRustPanicError, PrismaClientInitializationError, or smth unknown else"
    })
    async getEventsByName(@Param('name') name: string, @Res() res: Response) {
        console.log("request")
        this.eventService.getEventsByName(name).then(
            (data) => {
                return res.status(200).json(data)
            }
        ).catch((error) => {
            this.handlePrismaError(error, res);
        })
    }

    @Get('event_by_id/:id')
    @ApiOperation({summary: "get event by id"})
    @ApiOkResponse({type: EventDTOResponse, description: "return an event or null"})
    @ApiResponse({
        status: 400,
        schema: {
            example:
                {
                    message: 'message'
                }

        }, description:  AppController.errorDescription})
    @ApiResponse({
        status: 500,
        schema: {
            example:
                {
                    message: 'message'
                }

        },
        description: "returns error message if PrismaClientRustPanicError, PrismaClientInitializationError, or smth unknown else"
    })
    async getEventByID(@Param('id') id: number, @Res() res: Response) {
        console.log("request")
        this.eventService.getEventByID(id).then(
            (data) => {
                return res.status(200).json(data)
            }
        ).catch((error) => {
            this.handlePrismaError(error, res);
        })
    }

    @Get('locations')
    @ApiOperation({summary: "get locations"})
    @ApiOkResponse({
        isArray: true, type: LocationDTO, description: "return array of locations"
    })
    @ApiResponse({
        status: 400,
        schema: {
            example:
                {
                    message: 'message'
                }

        }, description:  AppController.errorDescription })
    @ApiResponse({
        status: 500,
        schema: {
            example:
                {
                    message: 'message'
                }

        },
        description: "returns error message if PrismaClientRustPanicError, PrismaClientInitializationError, or smth unknown else"
    })
    async getLocations(@Res() res: Response) {
        console.log("request")
        this.locationService.getLocations().then(
            (data) => {
                return res.status(200).json(data)
            }
        ).catch((error) => {
            this.handlePrismaError(error, res);
        })
    }

    @Get('types')
    @ApiOperation({summary: "get types"})
    @ApiOkResponse({isArray: true, type: EventTypeDTO, description: "return array of types"})
    @ApiResponse({
        status: 400,
        schema: {
            example:
                {
                    message: 'message'
                }

        }, description:  AppController.errorDescription})
    @ApiResponse({
        status: 500,
        schema: {
            example:
                {
                    message: 'message'
                }

        },
        description: "returns error message if PrismaClientRustPanicError, PrismaClientInitializationError, or smth unknown else"
    })
    async getTypes(@Res() res: Response) {
        console.log("request")
        this.typeEventService.getTypeEvents().then(
            (data) => {
                return res.status(200).json(data)
            }
        ).catch((error) => {
            this.handlePrismaError(error, res);
        })
    }

    @Get('statuses')
    @ApiOperation({summary: "get statuses of event"})
    @ApiOkResponse({isArray: true, type: EventStatusDTO, description: "return array of statuses"})
    @ApiResponse({
        status: 400,
        schema: {
            example:
                {
                    message: 'message'
                }

        },
        description:  AppController.errorDescription})
    @ApiResponse({
        status: 500,
        schema: {
            example:
                {
                    message: 'message'
                }

        },
        description: "returns error message if PrismaClientRustPanicError, PrismaClientInitializationError, or smth unknown else"
    })
    async getStatuses(@Res() res: Response) {
        console.log("request")
        this.statusEventService.getStatusEvents().then(
            (data) => {
                return res.status(200).json(data)
            }
        ).catch((error) => {
            this.handlePrismaError(error, res);
        })
    }

    private handlePrismaError(error: any, res: Response): Response<any, Record<string, any>> {
        console.error(error);
        if (error instanceof Prisma.PrismaClientKnownRequestError || error instanceof Prisma.PrismaClientValidationError || error instanceof Prisma.PrismaClientUnknownRequestError) {
            return res.status(400).json({message: error.message});
        }
        return res.status(500).json({message: error.message});
    }
}
