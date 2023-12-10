import { Test, TestingModule } from '@nestjs/testing';
import { ParticipantListService } from './participant-list.service';

describe('ParticipantListService', () => {
  let service: ParticipantListService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParticipantListService],
    }).compile();

    service = module.get<ParticipantListService>(ParticipantListService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
