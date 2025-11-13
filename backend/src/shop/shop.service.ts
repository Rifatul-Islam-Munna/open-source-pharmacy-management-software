import { HttpException, Injectable, Logger } from '@nestjs/common';
import { CreateShopDto, SearchShopProductDto, StockStatus } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { TenantConnectionService } from 'src/tenant-connection/tenant-connection.service';
import { ShopStockBatch, ShopStockBatchSchema } from './entities/shop.schema';
import { Medicine, MedicineSchema } from 'src/medicine/entities/medicine.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class ShopService {
  private logger = new Logger(ShopService.name)
  constructor(private tenantConnectionService:TenantConnectionService){}
  async create(createShopDto: CreateShopDto) {
    this.logger.log("create-shop",createShopDto)
    const connection = this.tenantConnectionService.getModel("test-pharma-user-location-1",ShopStockBatch.name,ShopStockBatchSchema);
     const dataToCreate = {
    ...createShopDto,
    shopMedicineId: new Types.ObjectId(createShopDto.shopMedicineId)
  };
 
    const createModel = await connection.create(dataToCreate);
    if(!createModel){
      throw new HttpException('Shop not created', 400);
    }
 this.logger.log("create-shop-return-data",createModel)
    return createModel

  }

// Assume SearchShopProductDto is exactly as previously given

 async findAll(query: SearchShopProductDto) {
  const {
    searchQuery,
    page = 1,
    limit = 10,
    stockStatus = [],
    sortBy = 'name-asc'
  } = query;

  this.logger.debug("query",query,"page",page,"limit",limit,"stockStatus",stockStatus,"sortBy",sortBy)

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

  // Build base filters for batches
  const filter: any = {};

  // Name and SKU search (assuming name is on batch for search)
  if (searchQuery) {
    filter.name = { $regex: searchQuery, $options: 'i' };
    // If searching in joined medicine name, do via $lookup or aggregation (see note below)
  }
  // Stock status (if a field exists on your data—adjust as needed)
 if (Array.isArray(stockStatus) && stockStatus.length > 0) {
  if (stockStatus.includes(StockStatus.IN_STOCK)) {
    filter.totalUnits = { $gt: 0 };
  } else if (stockStatus.includes(StockStatus.LOW_STOCK)) {
    filter.totalUnits = { $gt: 0, $lt: 5 };
  } else if (stockStatus.includes(StockStatus.OUT_OF_STOCK)) {
    filter.totalUnits = { $lt: 1 };
  }
}
  let sortByNormalized = (sortBy || 'name-asc').trim().toLowerCase();
  // Sort options
  const sort: any = {};
  if (sortByNormalized === 'name-asc') sort.name = 1;
  if (sortByNormalized === 'name-desc') sort.name = -1;
  if (sortByNormalized === 'expiry-asc') sort.expiryDate = 1;
  if (sortByNormalized === 'expiry-desc') sort.expiryDate = -1;
  if (sortByNormalized === 'price-asc') sort.sellingPrice = 1;
  if (sortByNormalized === 'price-desc') sort.sellingPrice = -1;
  if (sortByNormalized === 'quantity-asc') sort.totalUnits = -1;
  if (sortByNormalized === 'quantity-desc') sort.totalUnits = 1;

  // Query and populate
  const cursor = shopStockBatchModel
    .find(filter)
    .populate({
      path: 'shopMedicineId',
      model: medicineModel,
      select: "name dosageType generic strength manufacturer slug"
    })
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  const data = await cursor.exec();
  const total = await shopStockBatchModel.countDocuments(filter);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}



  findOne(id: number) {
    return `This action returns a #${id} shop`;
  }

 async update( updateShopDto: UpdateShopDto) {
    const shopStockBatchModel = this.tenantConnectionService.getModel(
    "test-pharma-user-location-1",
    ShopStockBatch.name,
    ShopStockBatchSchema
  );
    const data = await shopStockBatchModel.findOneAndUpdate({ _id: updateShopDto.id }, {$set:updateShopDto}, { new: true });
    if(!data){
      throw new HttpException('Shop not updated', 400);
    }
    return data
  }

  async remove(id: string) {
      const shopStockBatchModel = this.tenantConnectionService.getModel(
    "test-pharma-user-location-1",
    ShopStockBatch.name,
    ShopStockBatchSchema
  );
    const data = await shopStockBatchModel.findOneAndDelete({ _id: id });
    if(!data){
      throw new HttpException('Shop not deleted', 400);
    }
    return data
  }
}
