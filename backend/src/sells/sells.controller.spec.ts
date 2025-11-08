import { Test, TestingModule } from '@nestjs/testing';
import { SellsController } from './sells.controller';
import { SellsService } from './sells.service';

describe('SellsController', () => {
  let controller: SellsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SellsController],
      providers: [SellsService],
    }).compile();

    controller = module.get<SellsController>(SellsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
