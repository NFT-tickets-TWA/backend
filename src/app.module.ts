import {Module} from '@nestjs/common';


import {PrismaService} from './services/prisma.service';
import {PersonService} from './services/person.service';
import {EventService} from './services/event.service';
import { HttpModule } from "@nestjs/axios";

// import { SubredditService } from './subreddit.service';

import {Prisma} from '@prisma/client'
import {LocationService} from "./services/location.service";
import {StatusEventService} from "./services/statusEvent.service";
import {TypeEventService} from "./services/typeEvent.service";
import {WhiteListService} from "./services/whiteList.service";
import {EventController} from "./controllers/event.controller";
import {PersonController} from "./controllers/person.controller";
import {WhiteListController} from "./controllers/whiteList.controller";
import {LocationController} from "./controllers/location.controller";
import {TypeController} from "./controllers/type.controller";
import {StatusController} from "./controllers/status.controller";


import('@adminjs/prisma').then(({Database, Resource}) => {
    import('adminjs').then(({AdminJS}) => {
        AdminJS.registerAdapter({
            Resource: Resource,
            Database: Database,
        })
    })
})

const DEFAULT_ADMIN = {
    email: process.env.DEFAULT_ADMIN_MAIL,
    password: process.env.DEFAULT_ADMIN_PASS,
}

const authenticate = async (email: string, password: string) => {
    if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
        return Promise.resolve(DEFAULT_ADMIN)
    }
    return null
}

@Module({
    imports: [
      import('@adminjs/nestjs').then(({AdminModule}) => AdminModule.createAdminAsync({

            useFactory: () => {
                const prisma = new PrismaService()
                const dmmf = Prisma.dmmf
                const dm = dmmf.datamodel

                return {
                    adminJsOptions: {
                        rootPath: '/admin',
                        resources: [
                            {
                                resource: {model: dm.models[0], client: prisma},
                                options: {},
                            },
                            {
                                resource: {model: dm.models[1], client: prisma},
                                options: {},
                            },
                            {
                                resource: {model: dm.models[2], client: prisma},
                                options: {},
                            }, {
                                resource: {model: dm.models[3], client: prisma},
                                options: {},
                            },
                            {
                                resource: {model: dm.models[4], client: prisma},
                                options: {},
                            }, {
                                resource: {model: dm.models[5], client: prisma},
                                options: {},
                            },
                            {
                                resource: {model: dm.models[6], client: prisma},
                                options: {},
                            },
                            {
                                resource: {model: dm.models[7], client: prisma},
                                options: {},
                            },
                            {
                                resource: {model: dm.models[8], client: prisma},
                                options: {},
                            },
                            {
                                resource: {model: dm.models[9], client: prisma},
                                options: {},
                            },
                        ],
                    },
                    auth: {
                        authenticate,
                        cookieName: 'adminjs',
                        cookiePassword: 'secret'
                    },
                    sessionOptions: {
                        resave: true,
                        saveUninitialized: true,
                        secret: 'secret'
                    },
                }
            },
        })),
    HttpModule],
    controllers: [EventController, PersonController, WhiteListController, LocationController, TypeController,StatusController],
    providers: [PrismaService, PersonService, EventService, LocationService, StatusEventService, TypeEventService, WhiteListService],
})
export class AppModule {
}
