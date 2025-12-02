import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSellDto, CustomerSalesQueryDto, DashboardDateRangeDto, SalesQueryDto } from './dto/create-sell.dto';
import { UpdateSellDto } from './dto/update-sell.dto';
import { TenantConnectionService } from 'src/tenant-connection/tenant-connection.service';
import { ShopStockBatch, ShopStockBatchSchema } from 'src/shop/entities/shop.schema';
import { Sale, SaleDocument, SaleSchema } from './entities/sell.schema';
import { Types } from 'mongoose';
import { startOfToday, startOfWeek, startOfMonth, startOfYear, endOfDay, endOfWeek, endOfMonth, endOfYear } from 'date-fns';
import { PipelineStage } from 'mongoose';
@Injectable()
export class SellsService {
  constructor(private tenantConnectionService:TenantConnectionService){}
  private getSalesModel(slug:string){
    return  this.tenantConnectionService.getModel<SaleDocument>(slug,Sale.name,SaleSchema)
  }
  private getStoreModel(slug:string){
     return this.tenantConnectionService.getModel(slug,ShopStockBatch.name,ShopStockBatchSchema);
  }
 async create(createSellDto: CreateSellDto,userSlug:string) {
  

    const getSalesModel = this.getSalesModel(userSlug);
    const getStoreModel = this.getStoreModel(userSlug);

    const bulkOps = createSellDto.items.map(item => ({
  updateOne: {
    filter: { _id: new Types.ObjectId(item.medicineId), totalUnits: { $gte: item.quantity } },
    update: { $inc: { totalUnits: -item.quantity } },
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

async findAll(query: SalesQueryDto,userSlug:string) {
  const getSalesModel = this.getSalesModel(userSlug);
  

  // Default values
  const page = query.currentPage || 1;
  const limit = query.itemsPerPage || 10;
  const skip = (page - 1) * limit;

  // Build filter object
  const filter: any = {};

  // Search functionality (invoiceId, customerName, customerPhone)
/*   if (query.searchQuery) {
    const searchRegex = { $regex: query.searchQuery, $options: 'i' };
    filter.$or = [
      { invoiceId: searchRegex },
      { customerName: searchRegex },
      { customerPhone: searchRegex },
    ];
  } */
 if (query.searchQuery) {
  filter.$text = { $search: query.searchQuery };
}

  // Status filter
  if (query.status && query.status.length > 0) {
    filter.paymentStatus = { $in: query.status };
  }

  // Build sort object
  const sort: any = {};
  switch (query.sortBy) {
    case 'date-asc':
      sort.createdAt = 1;
      break;
    case 'date-desc':
      sort.createdAt = -1;
      break;
    case 'price-asc':
      sort.total = 1;
      break;
    case 'price-desc':
      sort.total = -1;
      break;
    case 'invoice-asc':
      sort.invoiceId = 1;
      break;
    case 'invoice-desc':
      sort.invoiceId = -1;
      break;
    default:
      sort.createdAt = -1; // default: newest first
  }

  // Execute query with aggregation pipeline for better performance
  const pipeline = [
    // Match stage (filter)
    { $match: filter },

    // Lookup medicines for medicine names (optional - if you want full medicine details)
    // {
    //   $addFields: {
    //     medicines: {
    //       $map: {
    //         input: '$items',
    //         as: 'item',
    //         in: '$$item.medicineName'
    //       }
    //     }
    //   }
    // },

    // Sort stage
    { $sort: sort },

    // Facet for pagination and total count
    {
      $facet: {
        data: [
          { $skip: skip },
          { $limit: limit },
        ],
        totalCount: [
          { $count: 'count' }
        ]
      }
    }
  ];

  const result = await getSalesModel.aggregate(pipeline).exec();

  const sales = result[0]?.data || [];
  const totalCount = result[0]?.totalCount[0]?.count || 0;

  return {
    sales,
    pagination: {
      currentPage: page,
      itemsPerPage: limit,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
      hasNextPage: page < Math.ceil(totalCount / limit),
      hasPrevPage: page > 1,
    }
  };
}

async findAllForCustomerSales(query: CustomerSalesQueryDto,userSlug:string) {
  const SaleModel = this.getSalesModel(userSlug);

  const match: any = {};

  // Search filter with regex on customerName, customerPhone, invoiceId
 /*  if (query.searchQuery) {
    const regex = new RegExp(query.searchQuery, 'i');
    match.$or = [
      { customerName: regex },
      { customerPhone: regex },
      { invoiceId: regex },
    ];
  } */
 if (query.searchQuery) {
  match.$text = { $search: query.searchQuery };
}

  // Payment status filter (directly from query.status)
  if (query.status && query.status.length > 0) {
    // PaymentStatus only has 'paid' or 'due', so we filter if frontend sent those
    const validStatuses = query.status.filter(s => s === 'paid' || s === 'due');
    if (validStatuses.length) {
      match.paymentStatus = { $in: validStatuses };
    }
  }

  // Sorting map
  const sortMap: Record<string, any> = {
    'name-asc': { customerName: 1 },
    'name-desc': { customerName: -1 },
    'due-asc': { total: 1 },
    'due-desc': { total: -1 },
    'date-asc': { createdAt: 1 },
    'date-desc': { createdAt: -1 },
  };
  const sort = sortMap[query.sortBy ?? 'date-desc'] ?? { createdAt: -1 };

  const page = query.currentPage ?? 1;
  const limit = Math.min(query.itemsPerPage ?? 10, 100);
  const skip = (page - 1) * limit;

  // Aggregation pipeline: match, sort, paginate
  const aggregationPipeline = [
    { $match: match },
    { $sort: sort },
    { $skip: skip },
    { $limit: limit },
    {
      $project: {
        items: 1,
        subtotal: 1,
        discountType: 1,
        discountValue: 1,
        discountAmount: 1,
        itemsDiscount: 1,
        totalDiscount: 1,
        total: 1,
        paymentStatus: 1,
        paidAmount: 1,
        customerName: 1,
        customerPhone: 1,
        issuedBy: 1,
        transactionId: 1,
        paymentType: 1,
        invoiceId: 1,
        createdAt: 1,
      },
    },
  ];

  const sales = await SaleModel.aggregate(aggregationPipeline).exec();

  // Count documents separately for pagination
  const totalCount = await SaleModel.countDocuments(match);

  return {
    sales, // raw sales documents as per schema with lean aggregation results
    pagination:{
       totalCount,
      itemsPerPage: limit,
      totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
         hasNextPage: page < Math.ceil(totalCount / limit),
      hasPrevPage: page > 1,
    },
   
  
 
    
  };
}

async markAsPaid(id: string,userSlug:string) {
    const getSalesModel = this.getSalesModel(userSlug);
  const findOne = await getSalesModel.findById(id).lean();
  if(!findOne) throw new HttpException('Sale not found',HttpStatus.BAD_REQUEST)

  const updateOne = await getSalesModel.updateOne({ _id: id }, { $set: { paymentStatus: 'paid',paidAmount:findOne.total } });
  if(!updateOne) throw new HttpException('Sale not updated',HttpStatus.BAD_REQUEST)
  return updateOne
  
}



// Service method with proper typing



async getDashboardData(filter: DashboardDateRangeDto,userSlug:string) {
  const SaleModel = this.getSalesModel(userSlug);

  let startDate: Date;
  let endDate: Date;

  // Determine the date range
  if (filter.range) {
    const now = new Date();
    switch (filter.range) {
      case 'today':
        startDate = startOfToday();
        endDate = endOfDay(now);
        break;
      case 'week':
        startDate = startOfWeek(now, { weekStartsOn: 1 }); // Monday start
        endDate = endOfWeek(now, { weekStartsOn: 1 });
        break;
      case 'month':
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
        break;
      case 'year':
        startDate = startOfYear(now);
        endDate = endOfYear(now);
        break;
      default:
        startDate = new Date(0);
        endDate = now;
    }
  } else if (filter.fromDate && filter.toDate) {
    startDate = new Date(filter.fromDate);
    endDate = new Date(filter.toDate);
    endDate.setHours(23, 59, 59, 999);
  } else {
    startDate = new Date(0);
    endDate = new Date();
  }

  const matchStage: PipelineStage = {
    $match: {
      createdAt: { $gte: startDate, $lte: endDate },
    },
  };

  // Helper to determine group key by range
  let timeGroupId: any = null;
  switch (filter.range) {
    case 'today':
      timeGroupId = { $hour: '$createdAt' };
      break;
    case 'week':
      timeGroupId = { $isoDayOfWeek: '$createdAt' };
      break;
    case 'month':
      timeGroupId = { $week: '$createdAt' };
      break;
    case 'year':
      timeGroupId = { $month: '$createdAt' };
      break;
    default:
      timeGroupId = {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' },
        day: { $dayOfMonth: '$createdAt' },
      };
  }

  // Main aggregation pipeline with proper typing
  const mainPipeline: PipelineStage[] = [
    matchStage,
    { $unwind: '$items' },
    {
      $group: {
        _id: timeGroupId,
        revenue: { $sum: '$total' },
        cost: { $sum: { $multiply: ['$items.originalPrice', '$items.quantity'] } },
        salesCount: { $sum: 1 },
        customers: { $addToSet: '$customerName' },
      },
    },
    {
      $addFields: {
        profit: { $round:[{ $subtract: ['$revenue', '$cost']},2] },
        customerCount: { $size: '$customers' },
      },
    },
    { $sort: { _id: 1 as 1 } }, // Explicitly cast to literal type 1
  ];

  // Top products aggregation with proper typing
  const topProductsPipeline: PipelineStage[] = [
    matchStage,
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.medicineName',
        units: { $sum: '$items.quantity' },
        revenue: { $sum: '$items.subtotal' },
      },
    },
    { $sort: { units: -1 as -1 } }, // Explicitly cast to literal type -1
    { $limit: 5 },
  ];

  // Overall summary (totals across entire range)
  const summaryPipeline: PipelineStage[] = [
    matchStage,
    { $unwind: '$items' },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$total' },
        totalCost: { $sum: { $multiply: ['$items.originalPrice', '$items.quantity'] } },
        totalSales: { $sum: 1 },
        uniqueCustomers: { $addToSet: '$customerName' },
        totalPaidAmount: { $sum: '$paidAmount' },
      },
    },
    {
      $addFields: {
        totalProfit: {$round:[ {$subtract: ['$totalRevenue', '$totalCost']} ,2]},
        customerCount: { $size: '$uniqueCustomers' },
        profitMargin: {
          $round: [
            
         
          {$multiply: [
            { $divide: [{ $subtract: ['$totalRevenue', '$totalCost'] }, '$totalRevenue'] },
            100,
          ],}
           ]
        },
      },
    },
  ];

  // Run all aggregations concurrently
  const [mainResults, topProducts, summary] = await Promise.all([
    SaleModel.aggregate(mainPipeline).exec(),
    SaleModel.aggregate(topProductsPipeline).exec(),
    SaleModel.aggregate(summaryPipeline).exec(),
  ]);

  const summaryData = summary[0] || {
    totalRevenue: 0,
    totalCost: 0,
    totalProfit: 0,
    totalSales: 0,
    customerCount: 0,
    profitMargin: 0,
    totalPaidAmount: 0,
  };

  return {
    summary: {
      totalRevenue: summaryData.totalRevenue,
      totalCost: summaryData.totalCost,
      totalProfit: summaryData.totalProfit,
      profitMargin: parseFloat(summaryData.profitMargin?.toFixed(1) || '0'),
      totalSales: summaryData.totalSales,
      customerCount: summaryData.customerCount,
      totalDue: summaryData.totalRevenue - summaryData.totalPaidAmount,
    },
    chartData: mainResults.map((item) => ({
      period: item._id,
      revenue: item.revenue,
      cost: item.cost,
      profit: item.profit,
      salesCount: item.salesCount,
      customerCount: item.customerCount,
    })),
    topProducts: topProducts.map((item) => ({
      name: item._id,
      units: item.units,
      revenue: item.revenue,
    })),
  };
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
