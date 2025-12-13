import { HttpException, Injectable, Logger } from '@nestjs/common';
import { CreateShopDto, SearchShopProductDto, StockStatus } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { TenantConnectionService } from 'src/tenant-connection/tenant-connection.service';
import { ShopStockBatch, ShopStockBatchDocument, ShopStockBatchSchema } from './entities/shop.schema';
import { Medicine, MedicineSchema } from 'src/medicine/entities/medicine.schema';
import { Model, Types } from 'mongoose';
import { AlertType, GetAlertsQueryDto, SortBy } from './dto/get-alerts-query.dto';
import { AlertItemDto, GetAlertsResponseDto } from './dto/alert-response.dto';


@Injectable()
export class ShopService {
  private logger = new Logger(ShopService.name)
  constructor(private tenantConnectionService:TenantConnectionService){}
  private getShopStockBatchModel(slug:string){
    return this.tenantConnectionService.getModel(slug,ShopStockBatch.name,ShopStockBatchSchema);
    
  }
  private getMedicineModel(slug:string){
    return this.tenantConnectionService.getModel(slug,Medicine.name,MedicineSchema);
    
  }
  async create(createShopDto: CreateShopDto,userSlug:string) {
    this.logger.log("create-shop",createShopDto)
    const connection = this.getShopStockBatchModel(userSlug)
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

 async findAll(query: SearchShopProductDto,userSlug:string) {
  const {
    searchQuery,
    page = 1,
    limit = 10,
    stockStatus = [],
    sortBy = 'name-asc'
  } = query;

  this.logger.debug("query",query,"page",page,"limit",limit,"stockStatus",stockStatus,"sortBy",sortBy)

  const shopStockBatchModel = this.getShopStockBatchModel(userSlug);
  
  
  const medicineModel = this.getMedicineModel(userSlug);

  // Build base filters for batches
  const filter: any = {};

  // Name and SKU search (assuming name is on batch for search)
  /* if (searchQuery) {
    filter.$text = { $search: query.searchQuery };
    // If searching in joined medicine name, do via $lookup or aggregation (see note below)
  } */
 if (searchQuery) {
  filter.name = {
    $regex: searchQuery,
    $options: 'i', // case-insensitive
  };
}
  // Stock status (if a field exists on your data—adjust as needed)
 if (Array.isArray(stockStatus) && stockStatus.length > 0) {
  if (stockStatus.includes(StockStatus.IN_STOCK)) {
    filter.totalUnits = { $gt: 0 };
  } else if (stockStatus.includes(StockStatus.LOW_STOCK)) {
    filter.totalUnits = { $gt: 0, $lt: 10 };
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


async getAlert(query:GetAlertsQueryDto,userSlug:string): Promise<GetAlertsResponseDto> {
  const shopStockBatchModel = this.getShopStockBatchModel(userSlug);

  const {
    filterType,
    sortBy = SortBy.URGENCY,
    page = 1,
    itemsPerPage = 8,
    searchQuery,
    expiryDaysThreshold,
    lowStockThreshold,
  } = query;

  const alerts: AlertItemDto[] = [];

  // Calculate expiry threshold date
  const expiryThresholdDate = new Date();
  expiryThresholdDate.setDate(
    expiryThresholdDate.getDate() + (expiryDaysThreshold ?? 10),
  );

  // ===== EXPIRING ALERTS =====
  if (filterType === AlertType.ALL || filterType === AlertType.EXPIRING) {
    const expiringPipeline: any[] = [
      {
        $match: {
          expiryDate: {
            $lte: expiryThresholdDate,
            $gte: new Date(),
          },
        },
      },
    ];

    // Add search filter if provided
    if (searchQuery) {
      expiringPipeline.push({
        $match: {
          $or: [
            { name: { $regex: searchQuery, $options: 'i' } },
            { batchNumber: { $regex: searchQuery, $options: 'i' } },
          ],
        },
      });
    }

    expiringPipeline.push(
      {
        $addFields: {
          daysUntilExpiry: {
            $ceil: {
              $divide: [
                { $subtract: ['$expiryDate', new Date()] },
                1000 * 60 * 60 * 24,
              ],
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          batchNumber: 1,
          expiryDate: 1,
          daysUntilExpiry: 1,
          shopMedicineId: 1,
        },
      },
    );

    const expiringBatches = await shopStockBatchModel.aggregate(
      expiringPipeline,
    );

    alerts.push(
      ...expiringBatches.map((batch) => ({
        id: batch._id.toString(),
        name: batch.name,
        batchName: batch.batchNumber,
        type: 'expiring' as const,
        expiryDate: batch.expiryDate,
        currentStock: null,  // matches DTO
        threshold: null,
        daysUntilExpiry: batch.daysUntilExpiry,
        shopMedicineId: batch.shopMedicineId.toString(),
      })),
    );
  }

  // ===== LOW STOCK ALERTS =====
  if (filterType === AlertType.ALL || filterType === AlertType.LOW_STOCK) {
    const lowStockPipeline: any[] = [];

    // Add search filter if provided
    if (searchQuery) {
      lowStockPipeline.push({
        $match: {
          $or: [
            { name: { $regex: searchQuery, $options: 'i' } },
            { batchNumber: { $regex: searchQuery, $options: 'i' } },
          ],
        },
      });
    }

    // Group by shopMedicineId to get total stock per medicine
    lowStockPipeline.push(
      {
        $group: {
          _id: '$shopMedicineId',
          name: { $first: '$name' },
          batchNumber: { $first: '$batchNumber' },
          totalStock: { $sum: '$totalUnits' },
          batches: {
            $push: {
              batchId: '$_id',
              batchNumber: '$batchNumber',
              units: '$totalUnits',
            },
          },
        },
      },
      {
        $match: {
          totalStock: { $lte: lowStockThreshold },
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          batchNumber: 1,
          totalStock: 1,
          shopMedicineId: '$_id',
        },
      },
    );

    const lowStockItems = await shopStockBatchModel.aggregate(
      lowStockPipeline,
    );

    alerts.push(
      ...lowStockItems.map((item) => ({
        id: item._id.toString(),
        name: item.name,
        batchName: item.batchNumber,
        type: 'low-stock' as const,
        expiryDate: null,        // matches DTO
        currentStock: item.totalStock,
        threshold: lowStockThreshold,
        daysUntilExpiry: null,
        shopMedicineId: item.shopMedicineId.toString(),
      })),
    );
  }

  // ===== SORTING =====
  this.sortAlerts(alerts, sortBy);

  // ===== PAGINATION =====
  const total = alerts.length;
  const totalPages = Math.ceil(total / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAlerts = alerts.slice(startIndex, endIndex);

  return {
    data: paginatedAlerts,
    total,
    page,
    itemsPerPage,
    totalPages,
  };
}

  private sortAlerts(alerts: AlertItemDto[], sortBy: SortBy): void {
    alerts.sort((a, b) => {
      switch (sortBy) {
        case SortBy.URGENCY:
          return (a.daysUntilExpiry || 999) - (b.daysUntilExpiry || 999);
        case SortBy.NAME_ASC:
          return a.name.localeCompare(b.name);
        case SortBy.NAME_DESC:
          return b.name.localeCompare(a.name);
        case SortBy.STOCK_ASC:
          return (a.currentStock || 999) - (b.currentStock || 999);
        case SortBy.STOCK_DESC:
          return (b.currentStock || 999) - (a.currentStock || 999);
        default:
          return 0;
      }
    });
  }





  findOne(id: number) {
    return `This action returns a #${id} shop`;
  }

 async update( updateShopDto: UpdateShopDto,userSlug:string) {
    const shopStockBatchModel = this.getShopStockBatchModel(userSlug);
    const data = await shopStockBatchModel.findOneAndUpdate({ _id: updateShopDto.id }, {$set:updateShopDto}, { new: true });
    if(!data){
      throw new HttpException('Shop not updated', 400);
    }
    return data
  }

  async remove(id: string,userSlug:string) {
      const shopStockBatchModel = this.getShopStockBatchModel(userSlug);
    const data = await shopStockBatchModel.findOneAndDelete({ _id: id });
    if(!data){
      throw new HttpException('Shop not deleted', 400);
    }
    return data
  }
}
