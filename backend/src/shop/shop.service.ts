import { HttpException, Injectable } from '@nestjs/common';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { TenantConnectionService } from 'src/tenant-connection/tenant-connection.service';
import { ShopStockBatch, ShopStockBatchSchema } from './entities/shop.schema';
import { Medicine, MedicineSchema } from 'src/medicine/entities/medicine.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class ShopService {
  constructor(private tenantConnectionService:TenantConnectionService){}
  async create(createShopDto: CreateShopDto) {
    const connection = this.tenantConnectionService.getModel("test-pharma-user-location-1",ShopStockBatch.name,ShopStockBatchSchema);
     const dataToCreate = {
    ...createShopDto,
    shopMedicineId: new Types.ObjectId(createShopDto.shopMedicineId)
  };

    const createModel = await connection.create(dataToCreate);
    if(!createModel){
      throw new HttpException('Shop not created', 400);
    }

    return createModel

  }

 async findAll() {
  const shopStockBatchModel = this.tenantConnectionService.getModel(
    "test-pharma-user-location-1",
    ShopStockBatch.name,
    ShopStockBatchSchema
  );
  
  const medicineModel = this.tenantConnectionService.getModel(
    "pharmicy-1",
    Medicine.name,
    MedicineSchema
  );
  
  
  
  // Now try populate
  const findAll = await shopStockBatchModel
    .find()
    .populate({
      path: 'shopMedicineId',
      model: medicineModel
    })
    .lean()
    .exec();
    
  console.log('Populated result:', findAll);
  return findAll;
}


  findOne(id: number) {
    return `This action returns a #${id} shop`;
  }

  update(id: number, updateShopDto: UpdateShopDto) {
    return `This action updates a #${id} shop`;
  }

  remove(id: number) {
    return `This action removes a #${id} shop`;
  }
}
