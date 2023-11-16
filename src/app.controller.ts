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
import {ContractEvent, EventDTO, EventDTOForPrint} from "./event";
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
    @ApiOkResponse({type: EventDTOForPrint, isArray:true})
    async getEvents() {
        return this.eventService.events();
    }

    @Post('event')
    @ApiOperation({summary: "create event contract and add it to the database"})
    @ApiOkResponse({type:Number})
    @ApiBadRequestResponse({type:String})
    async createEvent(@Body() eventData: EventDTO, @Res() res: Response) {
        console.log(eventData)
        const contractEvent = new ContractEvent(eventData.name, eventData.nftPattern, eventData.symbol, eventData.countOfRewardTokens);
        this.eventService.createEvent(eventData).then((data) => {
                createInternalEvent(contractEvent).then((response) => {
                    if (response.status == 200) {
                        this.eventService.updateCollectionAdr(data.id, response.hash).then(() => {
                                return res.status(200).json(data.id);
                            }
                        ).catch((error) => {
                            return res.status(500).json("impossible to update collection address")
                        })

                    } else {
                        this.eventService.delete(data.id).then(() => {
                                return res.status(response.status).json(response.message);
                            }
                        ).catch((error) => {
                            return res.status(response.status).json(response.message + "impossible to delete invalid event, please contact admin")
                        })
                    }
                }).then(()=>{

                })
            }
        ).catch((err) => {
            console.log(err.code)
            console.log(err.message)
            switch (err.code) {
                case 'P2002':
                    return res.status(400).json(`Duplicate field value: ${err.meta.target}`)
                case 'P2003':
                    return res.status(400).json(`Invalid input data: ${err.meta.target}`)
                default:
                    return res.status(500).json(`Something went wrong: ${err.message}`)
            }
        })

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
