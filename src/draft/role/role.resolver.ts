import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { RoleService } from './role.service';


@Resolver(() => String)
export class RoleResolver {
  constructor(private readonly roleService: RoleService) {}


  @Query(() => [String], { name: 'roleCollection' })
  findAll() {
    return this.roleService.findAll();
  }

}
