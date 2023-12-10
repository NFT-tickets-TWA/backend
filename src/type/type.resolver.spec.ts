import { Test, TestingModule } from '@nestjs/testing';
import { TypeResolver } from './type.resolver';
import { TypeService } from './type.service';

describe('TypeResolver', () => {
  let resolver: TypeResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TypeResolver, TypeService],
    }).compile();

    resolver = module.get<TypeResolver>(TypeResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
