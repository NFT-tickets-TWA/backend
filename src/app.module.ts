import {Module} from '@nestjs/common';
import { HttpModule } from "@nestjs/axios";
import {Prisma} from '@prisma/client'
import {GraphQLModule} from "@nestjs/graphql";
import {ApolloDriver, ApolloDriverConfig} from "@nestjs/apollo";
import {PrismaService} from "./prisma/prisma.service";
import {PrismaModule} from "./prisma/prisma.module";
import {PersonModule} from "./person/person.module";
import { StatusModule } from './status/status.module';
import { TypeModule } from './type/type.module';
import { RoleModule } from './role/role.module';
import { LocationModule } from './location/location.module';
import { UserRoleModule } from './user-role/user-role.module';
import { ParticipantStatusModule } from './participant-status/participant-status.module';
import { ParticipantListModule } from './participant-list/participant-list.module';
import { EventModule } from './event/event.module';
import {ParticipantListController} from "./rest/controllers/controller";


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
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: true,
            path:'/back',
            playground:true

            // include:[]
        }),
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
                            }
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
    HttpModule, PersonModule, PrismaModule, StatusModule, TypeModule, RoleModule, LocationModule, UserRoleModule, ParticipantStatusModule, ParticipantListModule, EventModule],
    controllers: [ParticipantListController],
    providers: []
})
export class AppModule {
}
