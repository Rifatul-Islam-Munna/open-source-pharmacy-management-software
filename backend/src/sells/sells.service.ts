import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSellDto } from './dto/create-sell.dto';
import { UpdateSellDto } from './dto/update-sell.dto';
import { TenantConnectionService } from 'src/tenant-connection/tenant-connection.service';
import { ShopStockBatch, ShopStockBatchSchema } from 'src/shop/entities/shop.schema';
import { Sale, SaleSchema } from './entities/sell.schema';

@Injectable()
export class SellsService {
  constructor(private tenantConnectionService:TenantConnectionService){}
 async create(createSellDto: CreateSellDto) {

    const getSalesModel = this.tenantConnectionService.getModel('test-pharma-user-location-1',Sale.name,SaleSchema);
    const getStoreModel = this.tenantConnectionService.getModel('test-pharma-user-location-1',ShopStockBatch.name,ShopStockBatchSchema);

    const bulkOps = createSellDto.items.map(item => ({
  updateOne: {
    filter: { _id: item.shopProductId, quantity: { $gte: item.quantity } },
    update: { $inc: { quantity: -item.quantity } },
  },
}));

 const result = await getStoreModel.bulkWrite(bulkOps);
 if (result.matchedCount !== createSellDto.items.length) {
  throw new HttpException('Some stock batches had insufficient quantity',HttpStatus.BAD_REQUEST);
 }


  const sale = await getSalesModel.create(createSellDto);
  if(!sale){
    throw new HttpException('Can not create try again',HttpStatus.BAD_REQUEST);
  }
  return{
    message:'Sale created successfully',
    data:sale
  }

    
  }

  findAll() {
    return `This action returns all sells`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sell`;
  }

  update(id: number, updateSellDto: UpdateSellDto) {
    return `This action updates a #${id} sell`;
  }

  remove(id: number) {
    return `This action removes a #${id} sell`;
  }
}
