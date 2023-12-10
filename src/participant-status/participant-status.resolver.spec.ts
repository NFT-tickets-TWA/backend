import { Test, TestingModule } from '@nestjs/testing';
import { ParticipantStatusResolver } from './participant-status.resolver';
import { ParticipantStatusService } from './participant-status.service';

describe('ParticipantStatusResolver', () => {
  let resolver: ParticipantStatusResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParticipantStatusResolver, ParticipantStatusService],
    }).compile();

    resolver = module.get<ParticipantStatusResolver>(ParticipantStatusResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
