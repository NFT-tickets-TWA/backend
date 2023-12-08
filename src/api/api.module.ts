import { Module } from '@nestjs/common';
import {PersonsModule} from "../persons.module";
import {ApiResolver} from "./api.resolver";

@Module({
    imports: [PersonsModule],
    controllers: [],
    providers:[ApiResolver]
})
export class ApiModule {}