import {Controller, Get, Res} from "@nestjs/common";
import {ApiOkResponse, ApiOperation, ApiTags} from "@nestjs/swagger";
import {LocationDTO} from "../stractures/stractures";
import {Response} from "express";
import {LocationService} from "../services/location.service";
import {handlePrismaError} from "./util";
import {Response400, Response500} from "../stractures/response";
@ApiTags("location")
@Controller("location")
export class LocationController{
    constructor( private readonly locationService: LocationService,) {
    }
    @Get()
    @ApiOperation({summary: "get locations", operationId:"getLocations", tags:["location"]})
    @ApiOkResponse({
        isArray: true, type: LocationDTO, description: "return array of locations"
    })
    @Response400()
    @Response500()
    async getLocations(@Res() res: Response) {
        console.log("request")
        this.locationService.getLocations().then(
            (data) => {
                return res.status(200).json(data)
            }
        ).catch((error) => {
            handlePrismaError(error, res);
        })
    }

}