import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { ShopService } from './shop.service';
import { CreateShopDto, SearchShopProductDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { DeleteDto } from 'lib/pagination.dto';
import { GetAlertsQueryDto } from './dto/get-alerts-query.dto';
import { AuthGuard,type ExpressRequest } from 'src/auth/auth.guard';
@Controller('shop')
@UseGuards(AuthGuard)
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Post('create-new-medicine')
  create(@Body() createShopDto: CreateShopDto,@Req() req:ExpressRequest) {
    return this.shopService.create(createShopDto,req.user.slug);
  }

  @Get()
  findAll(@Query() query: SearchShopProductDto,@Req() req:ExpressRequest) {
    return this.shopService.findAll(query,req.user.slug);
  }
  @Get('get-my-alerts')
  getAllMyAlerts(@Query() query:GetAlertsQueryDto,@Req() req:ExpressRequest) {
    return this.shopService.getAlert(query,req.user.slug);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shopService.findOne(+id);
  }

  @Patch('update-shop-medicine')
  update( @Body() updateShopDto: UpdateShopDto,@Req() req:ExpressRequest) {
    return this.shopService.update( updateShopDto,req.user.slug);
  }

  @Delete('delete-shop-medicine')
  remove(@Query() query:DeleteDto,@Req() req:ExpressRequest) {
    return this.shopService.remove(query.id!,req.user.slug);
  }
}
