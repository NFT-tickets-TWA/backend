import {Body, Controller, Get, Post, Res} from "@nestjs/common";
import {ApiOkResponse, ApiOperation, ApiTags} from "@nestjs/swagger";
import {LocationDTO, PersonDTO} from "../stractures/stractures";
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
    @Post()
    @ApiOperation({summary: "create location",operationId:"createLocation", tags:["location"]})
    @Response400()
    @Response500()
    async createLocation(@Body() location: LocationDTO, @Res() res: Response) {
        console.log("request: create location")
        this.locationService.createLocation(location).then(
            (data) => {
                return res.status(200).json()
            }
        ).catch((error) => {
            handlePrismaError(error, res);
        })
    }

}