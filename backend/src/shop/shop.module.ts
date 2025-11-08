import { Module } from '@nestjs/common';
import { ShopService } from './shop.service';
import { ShopController } from './shop.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ShopStockBatch, ShopStockBatchSchema } from './entities/shop.schema';

@Module({
  imports:[MongooseModule.forFeature([{name:ShopStockBatch.name,schema:ShopStockBatchSchema}])],
  controllers: [ShopController],
  providers: [ShopService],
})
export class ShopModule {}
