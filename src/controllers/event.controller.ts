import {Body, Controller, Get, Param, Post, Res} from "@nestjs/common";
import {ApiBody, ApiOkResponse, ApiOperation, ApiTags} from "@nestjs/swagger";
import {EventService} from "../services/event.service";
import {
    ContractEvent
} from "../stractures/stractures";
import {Response} from "express";
import {createInternalEvent} from "../contract/contract";
import {PersonService} from "../services/person.service";
import {handlePrismaError} from "./util";
import {convertEventDTORequestToEventDTO, EventDTORequest, EventDTOResponse} from "../stractures/event";
import {Response400, Response500, CustomResponse} from "../stractures/response";

@Controller('event')
@ApiTags("event")
export class EventController {
    constructor(private readonly eventService: EventService, private readonly personService: PersonService,) {
    }

    @Get()
    @ApiOperation({summary: "returns all events in database", operationId: "getEvents", tags:["event"]})
    @ApiOkResponse({type: EventDTOResponse, isArray: true, description: "array of events"})
    @Response400()
    @Response500()
    async getEvents(@Res() res: Response) {
        console.log("request")
        this.eventService.events().then((result) => {
            return res.status(200).json(result);
        })
            .catch((error) => {
                handlePrismaError(error, res);
            })
    }

    generateSymbol(): string {
        const symbols = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let result = '';
        for (let i = 0; i < 3; i++) {
            result += symbols.charAt(Math.floor(Math.random() * symbols.length));
        }
        return result;
    }

    @Post()
    @ApiOperation({summary: "create event contract and add it to the database", operationId: "createEvent", tags:["event", "person"]})
    @ApiOkResponse({type: Number, description: "return id of created event"})
    @Response400()
    @Response500()
    async createEvent(@Body() eventDataRequest: EventDTORequest, @Res() res: Response) {
        console.log(eventDataRequest)
        if(eventDataRequest.countOfRewardTokens<1){
            return res.status(400).json({message: "countOfRewardTokens must be more than 1"});
        }
        const contractEvent = new ContractEvent(eventDataRequest.name, eventDataRequest.nftIpfsUrl, this.generateSymbol(), eventDataRequest.countOfRewardTokens, eventDataRequest.isSBT);
        const id = this.personService.getPersonByTgId(eventDataRequest.creatorTgId).then(
            (person) => {
                const eventData = convertEventDTORequestToEventDTO(eventDataRequest, person.id)
                this.eventService.createEvent(eventData).then((data) => {
                        createInternalEvent(contractEvent).then((response) => {
                            console.log(response)
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
                    handlePrismaError(error, res);
                })
            }
        ).catch((error) => {
            handlePrismaError(error, res);
        })
    }
    @Get('events_by_tg/:id')
    @ApiOperation({summary: "get events by user telegram id", operationId:"getEventsById", tags:["event"]})
    @ApiOkResponse({ type:EventDTOResponse, isArray: true, description: "return array of events"})
    @Response400()
    @Response500()
    async getEventsById(@Param('id') id: string, @Res() res: Response) {
        console.log("events created by tg id user")
        this.eventService.getEventsByTgId(id).then(
            (data) => {
                return res.status(200).json(data)
            }
        ).catch((error) => {
            handlePrismaError(error, res);
        })
    }
    @Get('events_by_name/:name')
    @ApiOperation({summary: "get events by name", operationId:"getEventsByName",tags:["event"]})
    @ApiOkResponse({
        isArray: true, type: EventDTOResponse, description: "return array of events"
    })
    @Response400()
    @Response500()
    async getEventsByName(@Param('name') name: string, @Res() res: Response) {
        console.log("request")
        this.eventService.getEventsByName(name).then(
            (data) => {
                return res.status(200).json(data)
            }
        ).catch((error) => {
            handlePrismaError(error, res);
        })
    }
    @Get('event_by_id/:id')
    @ApiOperation({summary: "get event by id",operationId:"getEventByID", tags:["event"]})
    @ApiOkResponse({type: EventDTOResponse, description: "return an event or null"})
    @Response400()
    @Response500()
    async getEventByID(@Param('id') id: number, @Res() res: Response) {
        console.log("request")
        this.eventService.getEventByID(id).then(
            (data) => {
                return res.status(200).json(data)
            }
        ).catch((error) => {
            handlePrismaError(error, res);
        })
    }
    @Get('event_by_link/:link')
    @ApiOperation({summary: "get event by link",operationId:"getEventByLink", tags:["event"]})
    @ApiOkResponse({type: EventDTOResponse, description: "return an event or null"})
    @Response400()
    @Response500()
    async getEventByLink(@Param('link') link: string, @Res() res: Response) {
        console.log("request")
        this.eventService.getEventByLink(link).then(
            (data) => {
                return res.status(200).json(data)
            }
        ).catch((error) => {
            handlePrismaError(error, res);
        })
    }
    @Post('approveLink')
    @ApiOperation({summary: "update approve link by id",operationId:"updateApproveLink", tags:["event"]})
    @ApiBody({schema:{
            example:
                {
                    event_id:2,
                    approve_link:"link"
                }

        }})
    @Response400()
    @Response500()
    async updateApproveLink(@Body('event_id') id: number,@Body('approve_link') link:string, @Res() res: Response) {
        console.log("request:approve link")
        this.eventService.addApproveLink(id, link).then(
            (data) => {
                return res.status(200).json()
            }
        ).catch((error) => {
            handlePrismaError(error, res);
        })
    }


}