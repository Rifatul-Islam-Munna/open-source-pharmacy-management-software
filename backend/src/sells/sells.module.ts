import { Module } from '@nestjs/common';
import { SellsService } from './sells.service';
import { SellsController } from './sells.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ShopStockBatch, ShopStockBatchSchema } from 'src/shop/entities/shop.schema';

@Module({
  imports: [MongooseModule.forFeature([{name:ShopStockBatch.name,schema:ShopStockBatchSchema}])],
  controllers: [SellsController],
  providers: [SellsService],
})
export class SellsModule {}
