import {
    Controller,
    Get,
    Param,
    Post,
    Body,
    Put,
    Delete, Res,
} from '@nestjs/common';

// import {User as UserModel, Post as PostModel, Event} from '@prisma/client';
import {EventService} from './event.service';
import {PersonService} from './person.service';
import {Event} from '@prisma/client';
import {Request, Response} from "express";
import {createInternalEvent} from "./contract";
import {
    ContractEvent,
    convertEventDTORequestToEventDTO,
    EventDTO,
    EventDTOResponse,
    EventDTORequest,
    PersonDTO
} from "./event";
import {error} from "@prisma/internals/dist/logger";
import {ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiTags} from "@nestjs/swagger";

// import { Post as PostModel, User as UserModel } from '@prisma/client';


@Controller('api')
@ApiTags("API")
export class AppController {
    constructor(
        private readonly eventService: EventService,
        private readonly personService: PersonService,
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
    async createEvent(@Body() eventDataRequest: EventDTORequest, @Res() res: Response) {
        console.log(eventDataRequest)
        const contractEvent = new ContractEvent(eventDataRequest.name, eventDataRequest.nftIpfsUrl, this.generateSymbol(), eventDataRequest.countOfRewardTokens, eventDataRequest.SBTState);
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
                return res.status(400).json(error)
            }
        )


    }

    @Post('person')
    @ApiOperation({summary: "create person"})
    @ApiOkResponse({type: Number, description: "return id of created person"})
    @ApiBadRequestResponse({type: String, description: "return error"})
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
    @ApiOkResponse({ isArray: true, description: "return array of events"
    })
    @ApiBadRequestResponse({type: String, description: "return error"})
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
    // @Get('post/:id')
    // async getPostById(@Param('id') id: string): Promise<PostModel> {
    //     return this.postService.post({ id: Number(id) });
    // }
    //
    // @Get('feed')
    // async getPublishedPosts(): Promise<PostModel[]> {
    //     return this.postService.posts({
    //         where: {
    //             published: true,
    //         },
    //     });
    // }
    //
    // @Get('filtered-posts/:searchString')
    // async getFilteredPosts(
    //     @Param('searchString') searchString: string,
    // ): Promise<PostModel[]> {
    //     return this.postService.posts({
    //         where: {
    //             OR: [
    //                 {
    //                     title: { contains: searchString },
    //                 },
    //                 {
    //                     content: { contains: searchString },
    //                 },
    //             ],
    //         },
    //     });
    // }
    //
    // @Post('post')
    // async createDraft(@Body() postData: PostData): Promise<PostModel> {
    //     const { title, content, authorEmail } = postData;
    //
    //     return this.postService.createPost({
    //         title,
    //         content,
    //         author: {
    //             connect: { email: authorEmail },
    //         },
    //     });
    // }
    //
    // @Put('publish/:id')
    // async publishPost(@Param('id') id: string): Promise<PostModel> {
    //     return this.postService.updatePost({
    //         where: { id: Number(id) },
    //         data: { published: true },
    //     });
    // }
    //
    // @Delete('post/:id')
    // async removePost(@Param('id') id: string): Promise<PostModel> {
    //     return this.postService.removePost({ id: Number(id) });
    // }
    //
    // @Post('user')
    // async registerUser(@Body() userData: UserData): Promise<UserModel> {
    //     return this.userService.createUser(userData);
    // }
}
