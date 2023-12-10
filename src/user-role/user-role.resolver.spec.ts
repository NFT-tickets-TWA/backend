import { Test, TestingModule } from '@nestjs/testing';
import { UserRoleResolver } from './user-role.resolver';
import { UserRoleService } from './user-role.service';

describe('UserRoleResolver', () => {
  let resolver: UserRoleResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserRoleResolver, UserRoleService],
    }).compile();

    resolver = module.get<UserRoleResolver>(UserRoleResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
