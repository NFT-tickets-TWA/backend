import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserRoleService } from './user-role.service';
import { UserRole } from './entities/user-role.entity';


@Resolver(() => UserRole)
export class UserRoleResolver {
  constructor(private readonly userRoleService: UserRoleService) {}

}
