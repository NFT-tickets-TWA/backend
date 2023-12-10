import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleResolver } from './role.resolver';
import {PrismaModule} from "../prisma/prisma.module";

@Module({
  imports:[PrismaModule],
  providers: [RoleResolver, RoleService],
  exports:[RoleService]
})
export class RoleModule {}
