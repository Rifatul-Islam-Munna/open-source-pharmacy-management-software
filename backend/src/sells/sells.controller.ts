import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, UseGuards } from '@nestjs/common';
import { SellsService } from './sells.service';
import { CreateSellDto, CustomerSalesQueryDto, DashboardDateRangeDto, SalesQueryDto } from './dto/create-sell.dto';
import { UpdateSellDto } from './dto/update-sell.dto';
import { DeleteDto } from 'lib/pagination.dto';
import { AuthGuard,type ExpressRequest } from 'src/auth/auth.guard';

@Controller('sells')
@UseGuards(AuthGuard)
export class SellsController {
  constructor(private readonly sellsService: SellsService) {}

  @Post('create-new-sales')
  create(@Body() createSellDto: CreateSellDto,@Req() req:ExpressRequest) {
    return this.sellsService.create(createSellDto,req.user.slug,req.user.id);
  }

  @Get('get-my-sales')
  findAll(@Query() query:SalesQueryDto,@Req() req:ExpressRequest) {
    return this.sellsService.findAll(query,req.user.slug,req.user.id,req.user.role);
  }
  @Get('get-all-customer')
  findALlCustomer(@Query() query:CustomerSalesQueryDto,@Req() req:ExpressRequest) {
    return this.sellsService.findAllForCustomerSales(query,req.user.slug,req.user.id,req.user.role);
  }
  @Get('get-all-dashboardData')
  getAllDashboardData(@Query() query:DashboardDateRangeDto,@Req() req:ExpressRequest) {
    return this.sellsService.getDashboardData(query,req.user.slug,req.user.id,req.user.role);
  }
  @Get('get-all-seller-data')
  getAllSellerData(@Req() req:ExpressRequest) {
    return this.sellsService.sellerSells(req.user.slug);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sellsService.findOne(+id);
  }

    @Patch('mark-as-completed')
    
  markAsPaid(@Body() query:DeleteDto,@Req() req:ExpressRequest) {
    return this.sellsService.markAsPaid(query?.id!,req.user.slug);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSellDto: UpdateSellDto) {
    return this.sellsService.update(+id, updateSellDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sellsService.remove(+id);
  }
}
