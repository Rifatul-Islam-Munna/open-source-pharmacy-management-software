import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, UseGuards, Req } from '@nestjs/common';
import { PurchaseOrderService } from './purchase-order.service';
import { CreatePurchaseOrderDto, PurchaseOrdersFilterDto, updateMultiple } from './dto/create-purchase-order.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase-order.dto';
import { type Response } from 'express';
import { AuthGuard, type ExpressRequest } from 'src/auth/auth.guard';

@Controller('purchase-order')
@UseGuards(AuthGuard)
export class PurchaseOrderController {
  constructor(private readonly purchaseOrderService: PurchaseOrderService) {}

  @Post()
  create(@Body() createPurchaseOrderDto: CreatePurchaseOrderDto,@Req() req:ExpressRequest) {
    return this.purchaseOrderService.create(createPurchaseOrderDto,req.user.slug);
  }

  @Get()
  findAll(@Query() query:PurchaseOrdersFilterDto,@Req() req:ExpressRequest) {
    return this.purchaseOrderService.findAll(query,req.user.slug);
  }
  @Get('download-csv')
  downloadAsCsv(@Res() res:Response,@Req() req:ExpressRequest) {
    return this.purchaseOrderService.downloadAsCsv(res,req.user.slug);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purchaseOrderService.findOne(+id);
  }

  @Patch('updated')
  update( @Body() updatePurchaseOrderDto: UpdatePurchaseOrderDto,@Req() req:ExpressRequest) {
    return this.purchaseOrderService.update(updatePurchaseOrderDto,req.user.slug);
  }
  @Patch('updated-multiple')
  updateMultiple( @Body() updatePurchaseOrderDto: updateMultiple,@Req() req:ExpressRequest) {
    return this.purchaseOrderService.updateMultiple(updatePurchaseOrderDto,req.user.slug);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.purchaseOrderService.remove(+id);
  }
}
