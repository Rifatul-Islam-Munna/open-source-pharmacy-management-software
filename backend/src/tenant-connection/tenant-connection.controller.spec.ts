import { Test, TestingModule } from '@nestjs/testing';
import { TenantConnectionController } from './tenant-connection.controller';
import { TenantConnectionService } from './tenant-connection.service';

describe('TenantConnectionController', () => {
  let controller: TenantConnectionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TenantConnectionController],
      providers: [TenantConnectionService],
    }).compile();

    controller = module.get<TenantConnectionController>(TenantConnectionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
