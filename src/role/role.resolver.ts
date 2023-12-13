import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { RoleService } from './role.service';
import { Role } from './entities/role.entity';


@Resolver(() => Role)
export class RoleResolver {
  constructor(private readonly roleService: RoleService) {}


  @Query(() => [Role], { name: 'roleCollection' })
  findAll() {
    return this.roleService.findAll();
  }

  @Query(() => Role, { name: 'roleByID' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.roleService.findOne(id);
  }

}
