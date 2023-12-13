import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TypeService } from './type.service';


@Resolver(() => String)
export class TypeResolver {
  constructor(private readonly typeService: TypeService) {}
  @Query(() => [String], { name: 'typeCollection' })
  findAll() {
    return this.typeService.findAll();
  }

}
