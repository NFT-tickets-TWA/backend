import { Test, TestingModule } from '@nestjs/testing';
import { ParticipantListResolver } from './participant-list.resolver';
import { ParticipantListService } from './participant-list.service';

describe('ParticipantListResolver', () => {
  let resolver: ParticipantListResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParticipantListResolver, ParticipantListService],
    }).compile();

    resolver = module.get<ParticipantListResolver>(ParticipantListResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
