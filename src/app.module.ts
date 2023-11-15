import {Module} from '@nestjs/common';
import {AppController} from './app.controller';

import {PrismaService} from './prisma.service';
import {PersonService} from './person.service';
import {EventService} from './event.service';
import { HttpModule } from "@nestjs/axios";

// import { SubredditService } from './subreddit.service';

import {Prisma} from '@prisma/client'

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
        // AdminJS version 7 is ESM-only. In order to import it, you have to use dynamic imports.
        import('@adminjs/nestjs').then(({AdminModule}) => AdminModule.createAdminAsync({
            // imports: [DatabaseModule],
            // inject: [PrismaService],
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
    controllers: [AppController],
    providers: [PrismaService, PersonService, EventService],
})
export class AppModule {
}
