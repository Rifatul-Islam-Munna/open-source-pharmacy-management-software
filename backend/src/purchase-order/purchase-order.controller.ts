import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res } from '@nestjs/common';
import { PurchaseOrderService } from './purchase-order.service';
import { CreatePurchaseOrderDto, PurchaseOrdersFilterDto, updateMultiple } from './dto/create-purchase-order.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase-order.dto';
import { type Response } from 'express';

@Controller('purchase-order')
export class PurchaseOrderController {
  constructor(private readonly purchaseOrderService: PurchaseOrderService) {}

  @Post()
  create(@Body() createPurchaseOrderDto: CreatePurchaseOrderDto) {
    return this.purchaseOrderService.create(createPurchaseOrderDto);
  }

  @Get()
  findAll(@Query() query:PurchaseOrdersFilterDto) {
    return this.purchaseOrderService.findAll(query);
  }
  @Get('download-csv')
  downloadAsCsv(@Res() res:Response) {
    return this.purchaseOrderService.downloadAsCsv(res);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purchaseOrderService.findOne(+id);
  }

  @Patch('updated')
  update( @Body() updatePurchaseOrderDto: UpdatePurchaseOrderDto) {
    return this.purchaseOrderService.update(updatePurchaseOrderDto);
  }
  @Patch('updated-multiple')
  updateMultiple( @Body() updatePurchaseOrderDto: updateMultiple) {
    return this.purchaseOrderService.updateMultiple(updatePurchaseOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.purchaseOrderService.remove(+id);
  }
}
