import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SellsService } from './sells.service';
import { CreateSellDto, CustomerSalesQueryDto, DashboardDateRangeDto, SalesQueryDto } from './dto/create-sell.dto';
import { UpdateSellDto } from './dto/update-sell.dto';
import { DeleteDto } from 'lib/pagination.dto';

@Controller('sells')
export class SellsController {
  constructor(private readonly sellsService: SellsService) {}

  @Post('create-new-sales')
  create(@Body() createSellDto: CreateSellDto) {
    return this.sellsService.create(createSellDto);
  }

  @Get('get-my-sales')
  findAll(@Query() query:SalesQueryDto) {
    return this.sellsService.findAll(query);
  }
  @Get('get-all-customer')
  findALlCustomer(@Query() query:CustomerSalesQueryDto) {
    return this.sellsService.findAllForCustomerSales(query);
  }
  @Get('get-all-dashboardData')
  getAllDashboardData(@Query() query:DashboardDateRangeDto) {
    return this.sellsService.getDashboardData(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sellsService.findOne(+id);
  }

    @Patch('mark-as-completed')
    
  markAsPaid(@Body() query:DeleteDto) {
    return this.sellsService.markAsPaid(query?.id!);
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
