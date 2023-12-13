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
import { ParticipantListModule } from './participant-list/participant-list.module';
import { EventModule } from './event/event.module';
import {ParticipantListController} from "./rest/controllers/controller";
import {ApolloServerPluginLandingPageLocalDefault} from "@apollo/server/plugin/landingPage/default";


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
            autoSchemaFile:'schema.gql',
            path:'/back',
            playground: false,
            introspection:true,
            plugins: [ApolloServerPluginLandingPageLocalDefault()],


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
    HttpModule, PersonModule, PrismaModule, StatusModule, TypeModule, RoleModule, LocationModule, ParticipantListModule, EventModule],
    controllers: [ParticipantListController],
    providers: []
})
export class AppModule {
}
