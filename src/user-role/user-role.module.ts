import { Module } from '@nestjs/common';
import { UserRoleService } from './user-role.service';
import { UserRoleResolver } from './user-role.resolver';
import {PrismaModule} from "../prisma/prisma.module";

@Module({
  imports:[PrismaModule],
  providers: [UserRoleResolver, UserRoleService],
  exports:[UserRoleService]
})
export class UserRoleModule {}
