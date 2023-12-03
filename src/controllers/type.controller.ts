import {Controller, Get, Res} from "@nestjs/common";
import {ApiOkResponse, ApiOperation, ApiTags} from "@nestjs/swagger";
import {EventTypeDTO} from "../stractures/stractures";
import {Response} from "express";
import {TypeEventService} from "../services/typeEvent.service";
import {handlePrismaError} from "./util";
import {Response400, Response500} from "../stractures/response";
@ApiTags("type")
@Controller("type")
export class TypeController {
    constructor( private readonly typeEventService: TypeEventService,) {
    }
    @Get()
    @ApiOperation({summary: "get types", operationId:"getTypes", tags:["type"]})
    @ApiOkResponse({isArray: true, type: EventTypeDTO, description: "return array of types"})
    @Response400()
    @Response500()
    async getTypes(@Res() res: Response) {
        console.log("request")
        this.typeEventService.getTypeEvents().then(
            (data) => {
                return res.status(200).json(data)
            }
        ).catch((error) => {
            handlePrismaError(error, res);
        })
    }


}