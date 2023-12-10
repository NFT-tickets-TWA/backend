import {Controller, Param, Post, Res} from "@nestjs/common";
import {ApiOperation, ApiTags} from "@nestjs/swagger";
import {Response} from "express";
import {mintNft} from "../../contract/contract";
import {ParticipantListService} from "../../participant-list/participant-list.service";
import {handlePrismaError, Response400, Response500} from "../uril/responses";


@ApiTags("participantList")
@Controller("participantList")
export class ParticipantListController {
    constructor(private participantListService: ParticipantListService) {
    }

    @Post('mint/:event_id')
    @ApiOperation({summary: "mint nft after event", operationId: "mint", tags: ["nft", "person"]})
    @Response400()
    @Response500()
    async mintNFT(@Param("event_id") event_id: number, @Res() res: Response) {
        console.log("request: mint nft")
        this.participantListService.getApprovedPersons(event_id).then((participants) => {
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
                    //chech error
                    this.participantListService.sendNft(person_id, event_id);
                } else {
                    return res.status(data.status).json({message: data.message});
                }
            }
        ).catch((error) => {
            handlePrismaError(error, res)
        })
    }

}