import {Controller, Get, Res} from "@nestjs/common";
import {ApiOkResponse, ApiOperation, ApiTags} from "@nestjs/swagger";
import {EventStatusDTO} from "../stractures/stractures";
import {Response} from "express";
import {StatusEventService} from "../services/statusEvent.service";
import {handlePrismaError} from "./util";
import {Response400, Response500} from "../stractures/response";
@ApiTags("status")
@Controller("status")
export class StatusController{
    constructor(  private readonly statusEventService: StatusEventService,) {
    }
    @Get()
    @ApiOperation({summary: "get statuses of event",operationId:"getStatuses", tags:["status"]})
    @ApiOkResponse({isArray: true, type: EventStatusDTO, description: "return array of statuses"})
    @Response400()
    @Response500()
    async getStatuses(@Res() res: Response) {
        console.log("request")
        this.statusEventService.getStatusEvents().then(
            (data) => {
                return res.status(200).json(data)
            }
        ).catch((error) => {
            handlePrismaError(error, res);
        })
    }

}