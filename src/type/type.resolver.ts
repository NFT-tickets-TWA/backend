import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TypeService } from './type.service';
import { Type } from './entities/type.entity';


@Resolver(() => Type)
export class TypeResolver {
  constructor(private readonly typeService: TypeService) {}
  @Query(() => [Type], { name: 'typeCollection' })
  findAll() {
    return this.typeService.findAll();
  }

  @Query(() => Type, { name: 'typeByID' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.typeService.findOne(id);
  }

}
