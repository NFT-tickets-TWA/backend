import AdminJS from 'adminjs';
import '@adminjs/express';
import { AdminModule } from "@adminjs/nestjs";
import { Database, Resource } from '@adminjs/prisma';
import { PrismaClient } from '@prisma/client';
import { DMMFClass } from '@prisma/client/runtime';

const prisma = new PrismaClient();
const dmmf = (prisma as any)._dmmf as DMMFClass;

AdminJS.registerAdapter({ Database, Resource });

export default AdminModule.createAdmin({
  adminJsOptions: {
    rootPath: '/admin',
    resources: [
      {
        resource: { model: dmmf.modelMap.Person, client: prisma },
      },
      {
        resource: { model: dmmf.modelMap.UserRole, client: prisma },
      },
      {
        resource: { model: dmmf.modelMap.Role, client: prisma },
      },
      {
        resource: { model: dmmf.modelMap.NftStatus, client: prisma },
      },
      {
        resource: { model: dmmf.modelMap.NftList, client: prisma },
      },
      {
        resource: { model: dmmf.modelMap.WhiteList, client: prisma },
      },
      {
        resource: { model: dmmf.modelMap.Event, client: prisma },
      },
      {
        resource: { model: dmmf.modelMap.EventType, client: prisma },
      },
      {
        resource: { model: dmmf.modelMap.EventStatus, client: prisma },
      },
      {
        resource: { model: dmmf.modelMap.Location, client: prisma },
      },
    ],
  },
});
