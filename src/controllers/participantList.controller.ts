import {Body, Controller, Param, Post, Res} from "@nestjs/common";
import {ApiBody, ApiOkResponse, ApiOperation, ApiTags} from "@nestjs/swagger";
import {ParticipantListDTO} from "../stractures/stractures";
import {Response} from "express";
import {ParticipantListService} from "../services/participantList.service";
import {handlePrismaError} from "./util";
import {Response400, Response500} from "../stractures/response";
import {EventService} from "../services/event.service";
import {error} from "@prisma/internals/dist/logger";
import {mintNft} from "../contract/contract";

@ApiTags("participantList")
@Controller("participantList")
export class ParticipantListController {
    constructor(private readonly participantList: ParticipantListService, private readonly eventService: EventService) {
    }

    @Post('register')
    @ApiOperation({summary: "register user on event", operationId: "registerPersonOnEvent", tags: ["event", "person"]})
    @ApiBody({
        schema: {
            example:
                {
                    person_id: 1,
                    event_id: 2
                }
        }
    })
    @ApiOkResponse({type: Boolean, description: "return true if created in another case false"})
    async registerPersonOnEvent(@Body("person_id") person_id: number, @Body("event_id") event_id: number, @Res() res: Response) {
        console.log("request: register user on event")
        this.eventService.incrementParticipants(event_id).then(() => {
                this.participantList.register(person_id, event_id).then((result) => {
                    return res.status(200).json(true);
                })
                    .catch((error) => {
                        console.log(error)
                        return res.status(200).json(false);
                    })
            }
        ).catch((error) => {
            console.log(error)
            return res.status(200).json(false);
        })
    }

    @Post('approve')
    @ApiOperation({
        summary: "approve participant of user",
        operationId: "approveParticipation",
        tags: ["event", "person"]
    })
    @ApiBody({
        schema: {
            example:
                {
                    person_id: 1,
                    event_id: 2
                }
        }
    })
    @Response400()
    @Response500()
    async approveParticipation(@Body("person_id") person_id: number, @Body("event_id") event_id: number, @Res() res: Response) {
        console.log("request: approve person")
        this.participantList.changeStatus(person_id, event_id, "APPROVED").then((result) => {
            return res.status(200).json();
        })
            .catch((error) => {
                handlePrismaError(error, res);
            })
    }

    @Post('mint/:event_id')
    @ApiOperation({summary: "mint nft after event", operationId: "mint", tags: ["nft", "person"]})
    @Response400()
    @Response500()
    async mintNFT(@Param("event_id") event_id: number, @Res() res: Response) {
        console.log("request: mint nft")
        this.participantList.getApprovedPersonsByEvent(event_id).then((participants) => {
            const promises = [];
            participants.forEach((participant) => {
                promises.push(this.mint(participant.personID, participant.eventID, participant.person.walletAddress, participant.event.collectionAddr, participant.event.isSBT, res));
            })
            Promise.all(promises).then(() => {
                    return res.status(200).json();
                }
            ).catch((error) => {
                handlePrismaError(error, res);
            });

        })
            .catch((error) => {
                handlePrismaError(error, res);
            })
    }

    async mint(person_id: number, event_id: number, walletAddress: string, contractAddress: string, isSbt: boolean, res) {
        return mintNft(walletAddress, contractAddress, isSbt).then(
            (data) => {
                console.log(data)
                if (data.status == 200) {
                    this.participantList.changeStatus(person_id, event_id, "RECEIVED_NFT")
                } else {
                    return res.status(data.status).json({message: data.message});
                }
            }
        ).catch((error) => {
            handlePrismaError(error, res)
        })
    }

}