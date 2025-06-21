import { Test, TestingModule } from '@nestjs/testing';
import { InvitationGateway } from './invitation.gateway';

describe('InvitationGateway', () => {
  let gateway: InvitationGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InvitationGateway],
    }).compile();

    gateway = module.get<InvitationGateway>(InvitationGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
