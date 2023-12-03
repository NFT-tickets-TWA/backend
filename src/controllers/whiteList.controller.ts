import {Body, Controller, Post, Res} from "@nestjs/common";
import {ApiOkResponse, ApiOperation, ApiTags} from "@nestjs/swagger";
import {WhiteListDTO} from "../stractures/stractures";
import {Response} from "express";
import {WhiteListService} from "../services/whiteList.service";

@ApiTags("whiteList")
@Controller("whiteList")
export class WhiteListController {
    constructor(private readonly whiteListService: WhiteListService) {
    }
    @Post('register')
    @ApiOperation( {summary: "register user on event", operationId: "registerPersonOnEvent", tags:["event", "person"]})
    @ApiOkResponse({type: Boolean, description: "return true if created in another case false"})
    async registerPersonOnEvent(@Body() whiteListDTO: WhiteListDTO, @Res() res: Response) {
        console.log("request: register user on event")
        this.whiteListService.register(whiteListDTO).then((result) => {
            return res.status(200).json(true);
        })
            .catch(() => {
                return res.status(200).json(false);
            })
    }

}