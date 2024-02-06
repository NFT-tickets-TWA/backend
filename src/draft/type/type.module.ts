import { Module } from '@nestjs/common';
import { TypeService } from './type.service';
import { TypeResolver } from './type.resolver';
import {PrismaModule} from "../../prisma/prisma.module";

@Module({
  imports:[PrismaModule],
  providers: [TypeResolver, TypeService],
  exports:[TypeService]
})
export class TypeModule {}
