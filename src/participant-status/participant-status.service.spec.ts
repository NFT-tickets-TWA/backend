import { Test, TestingModule } from '@nestjs/testing';
import { ParticipantStatusService } from './participant-status.service';

describe('ParticipantStatusService', () => {
  let service: ParticipantStatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParticipantStatusService],
    }).compile();

    service = module.get<ParticipantStatusService>(ParticipantStatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
