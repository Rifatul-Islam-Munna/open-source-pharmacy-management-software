import { HttpException, Injectable, Logger } from '@nestjs/common';
import { CreatePurchaseOrderDto, PurchaseOrdersFilterDto, updateMultiple } from './dto/create-purchase-order.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase-order.dto';
import { ShopService } from 'src/shop/shop.service';
import { TenantConnectionService } from 'src/tenant-connection/tenant-connection.service';
import { PurchaseOrder, PurchaseOrderDocument, PurchaseOrderSchema } from './entities/purchase-order.entity';
import * as fastCsv from 'fast-csv';
import {type Response } from 'express';
@Injectable()
export class PurchaseOrderService {
  private logger = new Logger(ShopService.name)
    constructor(private tenantConnectionService:TenantConnectionService){}
    private getTheModel() {
      return this.tenantConnectionService.getModel<PurchaseOrderDocument>("test-pharma-user-location-1",PurchaseOrder.name,PurchaseOrderSchema);
    }
 async create(createPurchaseOrderDto: CreatePurchaseOrderDto) {
    const model = this.getTheModel();
      const createdOrder = model.create({
      ...createPurchaseOrderDto,
      status: createPurchaseOrderDto.status ?? 'pending',
      
    });
    return createdOrder
  }

 async findAll(query: PurchaseOrdersFilterDto) { 
  const {
    search,
    status = 'all',
    sortBy = 'date-desc',
    page = 1,
    rowsPerPage = 6,
  } = query;
  const model = this.getTheModel();

  const match: any = {};

  if (status !== 'all') {
    match.status = status;
  }

  if (search) {
    match.$text = { $search: search };
  }

  let sort: any = {};
  switch (sortBy) {
    case 'date-desc':
      sort = { createdAt: -1 };
      break;
    case 'date-asc':
      sort = { createdAt: 1 };
      break;
    case 'qty-asc':
      sort = { box: 1, quantity: 1 };
      break;
    case 'qty-desc':
      sort = { box: -1, quantity: -1 };
      break;
    default:
      sort = { createdAt: -1 };
  }

  const skip = (page - 1) * rowsPerPage;

  const pipeline = [
    { $match: match },
    { $sort: sort },
    {
      $facet: {
        paginatedResults: [{ $skip: skip }, { $limit: rowsPerPage }],
        totalCount: [{ $count: 'count' }],
      },
    },
  ];

  // Fixed: Added await here
  const result = await model.aggregate(pipeline).exec();

  const paginatedResults = result[0]?.paginatedResults ?? [];
  const totalCount = result[0]?.totalCount[0]?.count ?? 0;

  return {
    data: paginatedResults,
    totalCount,
    page,
    rowsPerPage,
    totalPages: Math.ceil(totalCount / rowsPerPage),
  };
}

async downloadAsCsv(res: Response) {
    const model = this.getTheModel();

    // Set CSV response headers
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="medicine-order.csv"');

    // Create CSV stream
    const csvStream = fastCsv.format({ headers: true });

    // Pipe CSV stream to response
    csvStream.pipe(res);

    // Use cursor to stream data from MongoDB
    const cursor = model.find({ status: 'pending' }).lean().cursor();

    for await (const doc of cursor) {
      // Write each document as CSV row
      csvStream.write({
        medicine: doc.medicine,
        quantity: doc.quantity,
        box: doc.box,
       
       
      });
    }

    // End the CSV stream
    csvStream.end();
  }
  

  

  findOne(id: number) {
    return `This action returns a #${id} purchaseOrder`;
  }

  async update( updatePurchaseOrderDto: UpdatePurchaseOrderDto) {
    const model = await this.getTheModel();

    const update  = await model.findOneAndUpdate({ _id: updatePurchaseOrderDto.id }, {$set:updatePurchaseOrderDto}, { new: true });
    if(!update){
      throw new HttpException('Purchase order not updated', 400);
    }
    return update

  }
  async updateMultiple(payload:updateMultiple){
    const model = await this.getTheModel();
    const { ids, type } = payload
    if(type === 'delete'){
      const update  = await model.deleteMany({ _id: { $in: ids } });
       if(update.deletedCount < 1){
       throw new HttpException('Purchase order not updated', 400);
     }
      return update
    }
    if(type === "approve"){
     const update  = await model.updateMany({ _id: { $in: ids } }, {$set:{status:"received"}});
     if(update.matchedCount < 1){
       throw new HttpException('Purchase order not updated', 400);
     }
     return update
    }
    throw new HttpException('Invalid type', 400);
   

  }

  remove(id: number) {
    return `This action removes a #${id} purchaseOrder`;
  }
}
