import { Resolver} from '@nestjs/graphql';

import { UserRole } from './entities/user-role.entity';


@Resolver(() => UserRole)
export class UserRoleResolver {
}
