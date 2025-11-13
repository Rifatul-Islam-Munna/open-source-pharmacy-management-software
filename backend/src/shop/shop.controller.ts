import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ShopService } from './shop.service';
import { CreateShopDto, SearchShopProductDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { DeleteDto } from 'lib/pagination.dto';

@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Post('create-new-medicine')
  create(@Body() createShopDto: CreateShopDto) {
    return this.shopService.create(createShopDto);
  }

  @Get()
  findAll(@Query() query: SearchShopProductDto) {
    return this.shopService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shopService.findOne(+id);
  }

  @Patch('update-shop-medicine')
  update( @Body() updateShopDto: UpdateShopDto) {
    return this.shopService.update( updateShopDto);
  }

  @Delete('delete-shop-medicine')
  remove(@Query() query:DeleteDto) {
    return this.shopService.remove(query.id!);
  }
}
