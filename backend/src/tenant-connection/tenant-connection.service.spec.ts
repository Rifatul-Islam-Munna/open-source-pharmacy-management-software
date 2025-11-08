import { Test, TestingModule } from '@nestjs/testing';
import { TenantConnectionService } from './tenant-connection.service';

describe('TenantConnectionService', () => {
  let service: TenantConnectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TenantConnectionService],
    }).compile();

    service = module.get<TenantConnectionService>(TenantConnectionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
