import {Body, Controller, Get, Param, Post, Res} from "@nestjs/common";
import {ApiOkResponse, ApiOperation, ApiTags} from "@nestjs/swagger";
import {PersonDTO} from "../stractures/stractures";
import {Response} from "express";
import {PersonService} from "../services/person.service";
import {handlePrismaError} from "./util";
import {Response400, Response500} from "../stractures/response";
@ApiTags("person")
@Controller("person")
export class PersonController{
    constructor( private readonly personService: PersonService,) {
    }
    @Post()
    @ApiOperation({summary: "create person",operationId:"createPerson", tags:["person"]})
    @ApiOkResponse({type: Number, description: "return id of created person"})
    @Response400()
    @Response500()
    async createPerson(@Body() person: PersonDTO, @Res() res: Response) {
        console.log("create person")
        this.personService.createPerson(person).then(
            (data) => {
                return res.status(200).json(data.id)
            }
        ).catch((error) => {
            handlePrismaError(error, res);
        })
    }
    @Get('person_by_tg/:id')
    @ApiOperation({summary: "get person and his roles by tg if no role return null", operationId:"getPersonById", tags:["person"]})
    @ApiOkResponse({
        schema: {
            example: [
                {
                    id: 1,
                    walletAddress: 'address',
                    roles: [{name:"ADMIN"}, {name:"USER"}]
                }
            ]
        },
        isArray: true,
        description: "returns error message if PrismaClientRustPanicError, PrismaClientInitializationError, or smth unknown else"
    })
    @Response400()
    @Response500()
    async getPersonById(@Param('id') id: string, @Res() res: Response) {
        console.log("person with role by tg id")
        this.personService.getRoleByIDPerson(id).then(
            (data) => {
                return res.status(200).json(data)
            }
        ).catch((error) => {
            handlePrismaError(error, res);
        })
    }
}